import { EquipmentInstance } from "../../equipment/model/IEquipment";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";

export interface IMaintenanceService {
	createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]>;
	deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<number>;
	getAllMaintenances(): Promise<MaintenanceInstance[]>;
	createMaintenance(maintenanceAttributes: MaintenanceCreationAttributes): Promise<MaintenanceInstance>;
}

export const MaintenanceMessages = {
	MAINTENANCE_NOT_FOUND: 'MAINTENANCE_NOT_FOUND',
	ERROR_CREATING_MAINTENANCE: 'ERROR_CREATING_MAINTENANCE',
	MAINTENANCE_CREATED: 'MAINTENANCE_CREATED',
	MAINTENANCE_FREQUENCY_NOT_FOUND: 'MAINTENANCE_FREQUENCY_NOT_FOUND'
}