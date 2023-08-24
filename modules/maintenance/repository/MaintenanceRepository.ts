import { singleton } from "tsyringe";
import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";
import { Maintenance } from "../model/Maintenance";
import { IMaintenanceRepository, MaintenanceIncludes } from "./IMaintenanceRepository";

@singleton()
export class MaintenanceRepository implements IMaintenanceRepository {
	public async getAllMaintenances(): Promise<MaintenanceInstance[]> {
		return Maintenance.findAll({
			include: MaintenanceIncludes,
			order: [
				['maintenance_date', 'DESC']
			]
		});
	}
	
	public async getMaintenanceById(id: number): Promise<MaintenanceInstance | null> {
		return Maintenance.findByPk(id, {
			include: MaintenanceIncludes
		});
	}

	public async getMaintenancesByEquipmentCode(equipmentCode: string): Promise<MaintenanceInstance[]> {
		const include = JSON.parse(JSON.stringify(MaintenanceIncludes));
		include[0].where = {
			code: equipmentCode
		}
		return Maintenance.findAll({
			include: include,
			order: [
				['maintenance_date', 'DESC']
			]
		});
	}

	public async createMaintenance(maintenanceAttributes: MaintenanceCreationAttributes): Promise<MaintenanceInstance> {
		return Maintenance.create(maintenanceAttributes);
	}

	public async saveMaintenance(maintenance: MaintenanceInstance): Promise<MaintenanceInstance> {
		return maintenance.save();
	}

	public async deleteMaintenance(maintenance: MaintenanceInstance): Promise<void> {
		return maintenance.destroy();
	}
}