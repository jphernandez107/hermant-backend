import { QueryOptions } from "sequelize";
import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";

export interface INextMaintenanceRepository {
	getNextMaintenancesList(): Promise<NextMaintenanceInstance[]>;
	removeNextMaintenancesByEquipmentId(equipmentId: number, options?: QueryOptions): Promise<number>;
	createNextMaintenancesInBulk(nextMaintenances: NextMaintenanceCreationAttributes[], options?: QueryOptions): Promise<NextMaintenanceInstance[]>;
}

export const NextMaintenanceIncludes = [
	{
		association: 'equipment'
	},
	{
		association: 'maintenance_frequency'
	}
];