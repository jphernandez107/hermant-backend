import { singleton } from "tsyringe";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { MaintenanceFrequency } from "../../maintenance/model/MaintenanceFrequency";
import { IMaintenanceFrequencyRepository } from "./IMaintenanceFrequecyRepository";

@singleton()
export class MaintenanceFrequencyRepository implements IMaintenanceFrequencyRepository {

	public async createMaintenanceFrequenciesInBulk(frequencies: number[], lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]> {
		return MaintenanceFrequency.bulkCreate(frequencies.map(frequency => {
			return {
				lubrication_sheet_id: lubricationSheetId,
				frequency: frequency
			}
		}));
	}

	public async deleteMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<number> {
		return MaintenanceFrequency.destroy({
			where: {
				lubrication_sheet_id: lubricationSheetId
			}
		});
	}

	public async deleteMaintenanceFrequency(maintenanceFrequency: MaintenanceFrequencyInstance): Promise<void> {
		return maintenanceFrequency.destroy();
	}

	public async getMaintenanceFrequencyByLubricationSheetIdAndFrequency(lubricationSheetId: number, frequency: number): Promise<MaintenanceFrequencyInstance | null> {
		return MaintenanceFrequency.findOne({
			where: {
				lubrication_sheet_id: lubricationSheetId,
				frequency: frequency
			}
		});
	}

	public async getMaintenanceFrequenciesByLubricationSheetId(lubricationSheetId: number): Promise<MaintenanceFrequencyInstance[]> {
		return MaintenanceFrequency.findAll({
			where: {
				lubrication_sheet_id: lubricationSheetId
			}
		});
	}
}