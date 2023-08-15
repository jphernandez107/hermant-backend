import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";
import { NextMaintenance } from "../model/NextMaintenance";
import { INextMaintenanceRepository, NextMaintenanceIncludes } from "./INextMaintenanceRepository";

export class NextMaintenanceRepository implements INextMaintenanceRepository {
	public async getNextMaintenancesList(): Promise<NextMaintenanceInstance[]> {
		return NextMaintenance.findAll({
			include: NextMaintenanceIncludes,
			order: [
				['maintenance_date', 'ASC']
			]
		});
	}

	public async removeNextMaintenancesByEquipmentId(equipmentId: number): Promise<number> {
		return NextMaintenance.destroy({
			where: {
				equipment_id: equipmentId
			}
		});
	}

	public async createNextMaintenancesInBulk(nextMaintenances: NextMaintenanceCreationAttributes[]): Promise<NextMaintenanceInstance[]> {
		return NextMaintenance.bulkCreate(nextMaintenances);
	}
}