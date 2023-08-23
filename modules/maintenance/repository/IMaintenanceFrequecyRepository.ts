import { QueryOptions } from "sequelize";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";

export interface IMaintenanceFrequencyRepository {
	createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number, options?: QueryOptions): Promise<MaintenanceFrequencyInstance[]>
	deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number, options?: QueryOptions): Promise<number>
	deleteMaintenanceFrequency(maintenanceFrequency: MaintenanceFrequencyInstance): Promise<void>
	getMaintenanceFrequencyByLubricationSheetIdAndFrequency(lubricationSheetId: number, frequency: number): Promise<MaintenanceFrequencyInstance | null>
	getMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]>
}