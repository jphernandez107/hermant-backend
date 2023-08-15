import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentHourAddedInBulk, IEquipmentService, EquipmentMessages } from './IEquipmentService';
import { IEquipmentRepository } from '../repository/IEquipmentRepository';
import { EquipmentHourCreationAttributes, EquipmentHourCreationInBulkAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';
import { IEquipmentHourRepository } from '../repository/IEquipmentHourRepository';
import { IConstructionSiteService, ConstructionSiteMessages } from 'modules/constructionSite/service/IConstructionSiteService';
import { ConstructionSiteInstance } from 'modules/constructionSite/model/IConstructionSite';
import { IMaintenanceService } from 'modules/maintenance/service/IMaintenanceService';
import { INextMaintenanceService } from 'modules/maintenance/service/INextMaintenanceService';
import { ILubricationSheetService, LubricationSheetMessages } from 'modules/lubricationSheet/service/ILubricationSheetService';

export class EquipmentService implements IEquipmentService {
	private equipmentRepository: IEquipmentRepository;
	private equipmentHourRepository: IEquipmentHourRepository;
	private constructionSiteService: IConstructionSiteService;
	private nextMaintenanceService: INextMaintenanceService;
	private lubricationSheetService: ILubricationSheetService;

	constructor(
		equipmentRepository: IEquipmentRepository, 
		equipmentHourRepository: IEquipmentHourRepository, 
		constructionSiteService: IConstructionSiteService, 
		nextMaintenanceService: INextMaintenanceService,
		lubricationSheetService: ILubricationSheetService
	) {
		this.equipmentRepository = equipmentRepository;
		this.equipmentHourRepository = equipmentHourRepository;
		this.constructionSiteService = constructionSiteService;
		this.nextMaintenanceService = nextMaintenanceService;
		this.lubricationSheetService = lubricationSheetService;
	}

	public async getAllEquipments(): Promise<EquipmentInstance[]> {
		const equipments = await this.equipmentRepository.getAllEquipments();
		if (equipments) equipments.forEach(this.processEquipments);
		return equipments;
	}

	public async getEquipmentByIdOrCode(id: number | null, code: string | null): Promise<EquipmentInstance | null> {
		let equipment: EquipmentInstance | null = null;
		if (id) {
			equipment = await this.equipmentRepository.getEquipmentById(id);
		} else if (code) {
			equipment = await this.equipmentRepository.getEquipmentByCode(code);
		} 
		this.processEquipments(equipment);
		return equipment;
	}

	public async createEquipment(equipmentAttributes: EquipmentCreationAttributes): Promise<EquipmentInstance> {
		return this.equipmentRepository.createEquipment(equipmentAttributes);
	}

	public async updateEquipment(id: number, equipmentAttributes: EquipmentCreationAttributes): Promise<[number, EquipmentInstance[]]> {
		return this.equipmentRepository.updateEquipment(id, equipmentAttributes);
	}

	public async deleteEquipment(id: number | null, code: string | null): Promise<void> {
		const equipment = await this.getEquipmentByIdOrCode(id, code);
		if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		return this.equipmentRepository.deleteEquipment(equipment!);
	}

	public async getAllEquipmentHours(): Promise<EquipmentHourInstance[]> {
		return this.equipmentHourRepository.getAllEquipmentHours();
	}

	public async addEquipmentHoursInBulk(equipmentHours: EquipmentHourCreationInBulkAttributes): Promise<EquipmentHourAddedInBulk> {
		const diffDays = Math.round((equipmentHours.end_date.getTime() - equipmentHours.start_date.getTime()) / (1000 * 60 * 60 * 24));
		const equipments = await this.getAllEquipments();
		if (!equipments) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		
		const equipmentsWithErrors: string[] = [];
		const equipmentsSuccessfullyModified: EquipmentInstance[] = [];
		for (let equipmentHour of equipmentHours.hours) {
			const equipment = equipments.find((equipment) => equipment.code === equipmentHour.code);
			if (!equipment) {
				equipmentsWithErrors.push(equipmentHour.code);
				continue;
			}
			const dailyUseHours = equipmentHour.hours / diffDays;
			const equipmentHoursToAdd: EquipmentHourCreationAttributes[] = [];
			for (let i = 0; i < diffDays; i++) {
				const date: Date = equipmentHours.start_date;
				date.setDate(date.getDate() + i);
				const equipmentHourAttributes = this.parseEquipmentHourCreationAttributes(dailyUseHours, date, equipmentHours, equipment);
				equipmentHoursToAdd.push(equipmentHourAttributes);
				equipment.partial_hours += equipmentHourAttributes.hours_to_add;
				equipment.total_hours += equipmentHourAttributes.hours_to_add;
			}
			try {
				await this.equipmentHourRepository.createEquipmentHoursInBulk(equipmentHoursToAdd);
				equipmentsSuccessfullyModified.push(equipment);
				await this.equipmentRepository.saveEquipment(equipment);
			} catch (error) {
				equipmentsWithErrors.push(equipment.code);
			}
		}
		this.nextMaintenanceService.updateNextMaintenancesForEquipments(equipmentsSuccessfullyModified);
		const message = this.equipmentHoursBulkAddedMessage(equipmentsSuccessfullyModified, equipmentsWithErrors);
		const statusCode = equipmentsWithErrors.length > 0 ? 400 : 200;
		return {
			statusCode: statusCode,
			message: message,
			equipments: equipmentsSuccessfullyModified,
			errors: equipmentsWithErrors
		};
	}

	public async addLubricationSheetToEquipment(equipment: EquipmentInstance, lubricationSheetId: number): Promise<EquipmentInstance> {
		const lubricationSheet = await this.lubricationSheetService.getLubricationSheetById(lubricationSheetId);
		if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		equipment.lubrication_sheet_id = lubricationSheet.id;
		return this.equipmentRepository.saveEquipment(equipment);
	}
	public async addEquipmentToSite(equipment: EquipmentInstance, siteId: number, siteCode: string): Promise<ConstructionSiteInstance> {
		const site = await this.constructionSiteService.getSiteByIdOrCode(siteId, siteCode);
		if (!site) throw new Error(i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
		equipment.construction_site_id = site.id;
		await this.equipmentRepository.saveEquipment(equipment);
		return site;
	}
	public async removeEquipmentFromSite(equipment: EquipmentInstance, siteId: number, siteCode: string): Promise<ConstructionSiteInstance> {
		const principalSite = await this.getEquipmentByIdOrCode(null, "T01");
		equipment.construction_site_id = principalSite.id || null; 
		await this.equipmentRepository.saveEquipment(equipment);
		const site = await this.constructionSiteService.getSiteByIdOrCode(siteId, siteCode);
		if (!site) throw new Error(i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
		return site;
	}
	public async resetEquipmentPartialHours(equipment: EquipmentInstance): Promise<EquipmentInstance> {
		equipment.partial_hours = 0;
		return this.equipmentRepository.saveEquipment(equipment);
	}
	public async getEquipmentHoursByEquipmentId(equipmentId: number): Promise<EquipmentHourInstance[]> {
		return this.equipmentHourRepository.getEquipmentHoursByEquipmentId(equipmentId);
	}

	private equipmentHoursBulkAddedMessage = (equipments: EquipmentInstance[], errors: string[]): string => {
		const successMessage = i18n.__(EquipmentMessages.EQUIPMENT_HOUR_BULK_ADDED, {
			equipments: equipments.map(eq => eq.code).join(", ")
		});
		if ((!errors || errors.length === 0) && equipments && equipments.length > 0) 
			return successMessage;
		
		const uniqueErrors = Array.from(new Set(errors));
		const errorMessage = i18n.__(EquipmentMessages.ERROR_ADDING_HOURS_TO_EQUIPMENTS, {
			errorEquipments: uniqueErrors.join(", ")
		});
	
		if (!equipments || equipments.length === 0)
			return errorMessage;
	
		return `${errorMessage} ${successMessage}`;
	}

	private parseEquipmentHourCreationAttributes(hoursToAdd: number, date: Date, equipmentHours: EquipmentHourCreationInBulkAttributes, equipment: EquipmentInstance): EquipmentHourCreationAttributes {
		return {
			hours_to_add: hoursToAdd,
			total_hours: equipment.total_hours,
			partial_hours: equipment.partial_hours,
			date: date,
			observations: `Added in bulk from date: ${equipmentHours.start_date} to date: ${equipmentHours.end_date}. On date: ${new Date()}`,
			equipment_id: equipment.id,
			construction_site_id: equipment.construction_site_id,
			user_id: equipmentHours.user_id
		};
	}

	private processEquipments(equipment: EquipmentInstance): void {
		const firstMaintenance = equipment.next_maintenances.map((maint) => maint.maintenance_date);
		const next_maintenance: Date = firstMaintenance.minDate();
		equipment.next_maintenance = next_maintenance;
	}
}