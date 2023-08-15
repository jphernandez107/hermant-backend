import { EquipmentInstance } from "modules/equipment/model/IEquipment";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { IMaintenanceFrequencyRepository } from "../repository/IMaintenanceFrequecyRepository";
import { IMaintenanceService, MaintenanceMessages } from "./IMaintenanceService";
import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";
import { EquipmentMessages, IEquipmentService } from "modules/equipment/service/IEquipmentService";
import { Maintenance } from "../model/Maintenance";
import { IMaintenanceSparePartService } from "./IMaintenanceSparePartService";
import { MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";

export class MaintenanceService implements IMaintenanceService {
	private maintenanceFrequencyRepository: IMaintenanceFrequencyRepository;
	private equipmentService: IEquipmentService;
	private maintenanceSparePartService: IMaintenanceSparePartService;

	constructor(
		maintenanceFrequencyRepository: IMaintenanceFrequencyRepository, 
		equipmentService: IEquipmentService, 
		maintenanceSparePartService: IMaintenanceSparePartService
	) {
		this.maintenanceFrequencyRepository = maintenanceFrequencyRepository;
		this.equipmentService = equipmentService;
		this.maintenanceSparePartService = maintenanceSparePartService;
	}

	public async createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]> {
		return this.maintenanceFrequencyRepository.createMaintenanceFrequenciesInBulk(frequencies, lubricationSheetId);
	}

	public async deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<number> {
		return this.maintenanceFrequencyRepository.deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId);
	}

	public async getAllMaintenances(): Promise<MaintenanceInstance[]> {
		return Maintenance.findAll();
	}

	public async createMaintenance(maintenanceAttributes: MaintenanceCreationAttributes): Promise<MaintenanceInstance> {
		const equipment = await this.equipmentService.getEquipmentByIdOrCode(null, maintenanceAttributes.equipment_code);
		if (!equipment) throw new Error(EquipmentMessages.EQUIPMENT_NOT_FOUND)
		const maintenanceFrequency = await this.maintenanceFrequencyRepository.getMaintenanceFrequencyByLubricationSheetIdAndFrequency(equipment.lubrication_sheet_id, maintenanceAttributes.maintenance_frequency);
		if (!maintenanceFrequency) throw new Error(MaintenanceMessages.MAINTENANCE_FREQUENCY_NOT_FOUND);
		this.fillMaintenanceCreationAttributes(maintenanceAttributes, maintenanceFrequency, equipment);
		const maintenance = await Maintenance.create(maintenanceAttributes);
		if (!maintenance) throw new Error(MaintenanceMessages.ERROR_CREATING_MAINTENANCE);
		const replacedParts = await this.maintenanceSparePartService.createMaintenanceSparePartsInBulk(maintenanceAttributes.spare_parts, maintenance);
		this.setMaintenanceTotalCost(replacedParts, maintenance);
		this.resetEquipmentPartialHours(maintenanceAttributes.reset_equipment_partial_hours, equipment);

		return maintenance;
	}

	private fillMaintenanceCreationAttributes(maintenanceAttributes: MaintenanceCreationAttributes, maintenanceFrequency: MaintenanceFrequencyInstance, equipment: EquipmentInstance): void {
		maintenanceAttributes.equipment_id = equipment.id;
		maintenanceAttributes.equipment_partial_hours = equipment.partial_hours;
		maintenanceAttributes.equipment_total_hours = equipment.total_hours;
		maintenanceAttributes.maintenance_frequency_id = maintenanceFrequency.id;
	}

	private async setMaintenanceTotalCost(maintenanceSpareParts: MaintenanceSparePartInstance[], maintenance: MaintenanceInstance): Promise<MaintenanceInstance> {
		maintenance.maintenance_cost = maintenanceSpareParts.reduce((total, part) => total += part.partial_cost, 0);
		return await maintenance.save();
	}

	private async resetEquipmentPartialHours(resetPartialHours: boolean, equipment: EquipmentInstance): Promise<void> {
		if (resetPartialHours) await this.equipmentService.resetEquipmentPartialHours(equipment);
	}

}