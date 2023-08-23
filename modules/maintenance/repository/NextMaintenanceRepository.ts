import { singleton } from "tsyringe";
import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";
import { NextMaintenance } from "../model/NextMaintenance";
import { INextMaintenanceRepository, NextMaintenanceIncludes } from "./INextMaintenanceRepository";
import { QueryOptions } from "sequelize";

@singleton()
export class NextMaintenanceRepository implements INextMaintenanceRepository {
	public async getNextMaintenancesList(): Promise<NextMaintenanceInstance[]> {
		return NextMaintenance.findAll({
			include: NextMaintenanceIncludes,
			order: [
				['maintenance_date', 'ASC']
			]
		});
	}

	public async removeNextMaintenancesByEquipmentId(equipmentId: number, options?: QueryOptions): Promise<number> {
		return NextMaintenance.destroy({
			where: {
				equipment_id: equipmentId
			},
			...options
		});
	}

	public async createNextMaintenancesInBulk(nextMaintenances: NextMaintenanceCreationAttributes[], options?: QueryOptions): Promise<NextMaintenanceInstance[]> {
		return NextMaintenance.bulkCreate(nextMaintenances, options);
	}
}