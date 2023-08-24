import { inject, injectable, singleton } from "tsyringe";
import { EquipmentInstance } from "../../equipment/model/IEquipment";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { IMaintenanceFrequencyRepository } from "../repository/IMaintenanceFrequecyRepository";
import { IMaintenanceService, MaintenanceMessages } from "./IMaintenanceService";
import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";
import { Maintenance } from "../model/Maintenance";
import { IMaintenanceSparePartService } from "./IMaintenanceSparePartService";
import { MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";
import { MaintenanceFrequencyRepository } from "../repository/MaintenanceFrequencyRepository";
import { MaintenanceSparePartService } from "./MaintenanceSparePartService";
import { IEquipmentRepository } from "../../equipment/repository/IEquipmentRepository";
import { EquipmentRepository } from "../../equipment/repository/EquipmentRepository";
import { EquipmentMessages } from "../../equipment/service/IEquipmentService";
import i18n from 'i18n';
import { QueryOptions } from "sequelize";

@singleton()
@injectable()
export class MaintenanceService implements IMaintenanceService {

	constructor(
		@inject(MaintenanceFrequencyRepository) private maintenanceFrequencyRepository: IMaintenanceFrequencyRepository,
		@inject(EquipmentRepository) private equipmentRepository: IEquipmentRepository, 
		@inject(MaintenanceSparePartService) private maintenanceSparePartService: IMaintenanceSparePartService
	) {}

	public async createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number, options?: QueryOptions): Promise<MaintenanceFrequencyInstance[]> {
		return this.maintenanceFrequencyRepository.createMaintenanceFrequenciesInBulk(frequencies, lubricationSheetId, options);
	}

	public async deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number, options?: QueryOptions): Promise<number> {
		try {
			return await this.maintenanceFrequencyRepository.deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId, options);
		} catch (error) {
			console.log("~ file: MaintenanceService.ts:40 ~ MaintenanceService ~ deleteMaintenanceFrequenciesByLubricationSheetId ~ error:", error)
			return null;
		}
	}

	public async getAllMaintenances(): Promise<MaintenanceInstance[]> {
		return Maintenance.findAll();
	}

	public async createMaintenance(maintenanceAttributes: MaintenanceCreationAttributes): Promise<MaintenanceInstance> {
		const equipment = await this.equipmentRepository.getEquipmentByCode(maintenanceAttributes.equipment_code);
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
		if (resetPartialHours) await this.equipmentRepository.resetEquipmentPartialHours(equipment);
	}

}