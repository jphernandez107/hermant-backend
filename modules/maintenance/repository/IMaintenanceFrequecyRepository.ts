import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";

export interface IMaintenanceFrequencyRepository {
	createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]>
	deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<number>
	deleteMaintenanceFrequency(maintenanceFrequency: MaintenanceFrequencyInstance): Promise<void>
	getMaintenanceFrequencyByLubricationSheetIdAndFrequency(lubricationSheetId: number, frequency: number): Promise<MaintenanceFrequencyInstance | null>
	getMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]>
}