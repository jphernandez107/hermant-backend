import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { LubricationSheetSparePartCreationAttributes, LubricationSheetSparePartInstance } from "../model/ILubricationSheetSparePart";
import { ILubricationSheetRepository } from "../repository/ILubricationSheetRepository";
import { ILubricationSheetService, LubricationSheetMessages } from "./ILubricationSheetService";
import { ILubricationSheetSparePartRepository } from "../repository/ILubricationSheetSparePartRepository";
import { EquipmentMessages } from "../../equipment/service/IEquipmentService";
import { MaintenanceFrequencyInstance } from "../../maintenance/model/IMaintenanceFrequency";
import { IMaintenanceService } from "../../maintenance/service/IMaintenanceService";
import { INextMaintenanceService } from "../../maintenance/service/INextMaintenanceService";
import { LubricationSheetRepository } from "../repository/LubricationSheetRepository";
import { LubricationSheetSparePartRepository } from "../repository/LubricationSheetSparePartRepository";
import { inject, injectable, singleton } from "tsyringe";
import { MaintenanceService } from "../../maintenance/service/MaintenanceService";
import { NextMaintenanceService } from "../../maintenance/service/NextMaintenanceService";
import { EquipmentRepository } from "../../equipment/repository/EquipmentRepository";
import { IEquipmentRepository } from "../../equipment/repository/IEquipmentRepository";
import i18n from 'i18n';

@singleton()
@injectable()
export class LubricationSheetService implements ILubricationSheetService {
	
	constructor(
		@inject(LubricationSheetRepository) private lubricationSheetRepository: ILubricationSheetRepository,
		@inject(LubricationSheetSparePartRepository) private lubricationSheetSparePartRepository: ILubricationSheetSparePartRepository,
		@inject(MaintenanceService) private maintenanceService: IMaintenanceService,
		@inject(EquipmentRepository) private equipmentRepository: IEquipmentRepository,
		@inject(NextMaintenanceService) private nextMaintenanceService: INextMaintenanceService
	) {}

	public async getAllLubricationSheets(): Promise<LubricationSheetInstance[]> {
		return this.lubricationSheetRepository.getAllLubricationSheets();
	}

	public async getLubricationSheetById(id: number): Promise<LubricationSheetInstance | null> {
		return this.lubricationSheetRepository.getLubricationSheetById(id);
	}

	public async getLubricationSheetByEquipmentCode(equipmentCode: string): Promise<LubricationSheetInstance | null> {
		return this.lubricationSheetRepository.getLubricationSheetByEquipmentCode(equipmentCode);
	}

	public async createLubricationSheet(): Promise<LubricationSheetInstance> {
		return this.lubricationSheetRepository.createLubricationSheet();
	}

	public async updateLubricationSheet(id: number, lubricationSheetAttributes: LubricationSheetCreationAttributes): Promise<[number, LubricationSheetInstance]> {
		const lubricationSheet = await this.getLubricationSheetById(id);
		if (!lubricationSheet) throw new Error(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND);
		const count = await this.lubricationSheetRepository.updateLubricationSheet(id, lubricationSheetAttributes);
		return [count[0], lubricationSheet];
	}

	public async deleteLubricationSheet(id: number): Promise<void> {
		const lubricationSheet = await this.getLubricationSheetById(id);
		if (!lubricationSheet) throw new Error(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND);
		return this.lubricationSheetRepository.deleteLubricationSheet(lubricationSheet);
	}

	public async addSparePartsToLubricationSheet(lubricationSheetAttributes: LubricationSheetCreationAttributes): Promise<LubricationSheetInstance> {
		this.clearLubricationSheet(lubricationSheetAttributes.id);
		const equipment = await this.equipmentRepository.getEquipmentByCode(lubricationSheetAttributes.equipment_code);
		if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		const sheet = await this.findOrCreateLubricationSheet(lubricationSheetAttributes.id);
		if (!sheet) throw new Error(LubricationSheetMessages.ERROR_CREATING_LUBRICATION_SHEET);
		const frequencies = await this.createMaintenanceFrequencies(lubricationSheetAttributes.frequencies, sheet.id);
		if (!frequencies) throw new Error(LubricationSheetMessages.ERROR_CREATING_MAINTENANCE_FREQUENCIES);
		const sheetRows = await this.lubricationSheetSparePartRepository.createLubricationSheetSparePartsInBulk(lubricationSheetAttributes.spare_parts, sheet.id);
		if (!sheetRows) throw new Error(LubricationSheetMessages.ERROR_CREATING_SHEET_ROWS);
		await this.linkMaintenanceFrequenciesToLubricationSheetSpareParts(sheetRows, frequencies, lubricationSheetAttributes.spare_parts);
		equipment.lubrication_sheet_id = sheet.id;
		await this.nextMaintenanceService.updateNextMaintenancesForEquipments([...sheet.equipments || [], equipment]);
		sheet.addEquipment(equipment);
		return await this.lubricationSheetRepository.saveLubricationSheet(sheet);
	}

	private async findOrCreateLubricationSheet(lubricationSheetId: number | null): Promise<LubricationSheetInstance> {
		const lubricationSheet = await this.getLubricationSheetById(lubricationSheetId);
		if (lubricationSheet) return lubricationSheet;
		return await this.createLubricationSheet();
	}


	private async clearLubricationSheet(lubricationSheetId: number | null): Promise<void> {
		await this.maintenanceService.deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId);
		await this.lubricationSheetSparePartRepository.deleteByLubricationSheetId(lubricationSheetId);
	}

	private async createMaintenanceFrequencies(frequencies: number[], lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]> {
		return await this.maintenanceService.createMaintenanceFrequenciesInBulk(frequencies, lubricationSheetId);
	}

	private async linkMaintenanceFrequenciesToLubricationSheetSpareParts(sheetRows: LubricationSheetSparePartInstance[], frequencies: MaintenanceFrequencyInstance[], lubricationSheetSpareParts: LubricationSheetSparePartCreationAttributes[]): Promise<void> {
		for (let i=0; i<lubricationSheetSpareParts.length; i++) {
			const part = lubricationSheetSpareParts[i];
			const freqs = frequencies.filter(freq => part.frequencies.includes(freq.frequency));
			const row = sheetRows.find(row => row.spare_part_id === part.spare_part_id && row.application === part.application && row.quantity === part.quantity)
			this.lubricationSheetSparePartRepository.addFrequenciesToLubricationSheetSpareParts(row, freqs);
		}
	}
}