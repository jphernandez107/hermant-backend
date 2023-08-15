import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";

export interface INextMaintenanceRepository {
	getNextMaintenancesList(): Promise<NextMaintenanceInstance[]>;
	removeNextMaintenancesByEquipmentId(equipmentId: number): Promise<number>;
	createNextMaintenancesInBulk(nextMaintenances: NextMaintenanceCreationAttributes[]): Promise<NextMaintenanceInstance[]>;
}

export const NextMaintenanceIncludes = [
	{
		association: 'equipment'
	},
	{
		association: 'maintenance_frequency'
	}
];