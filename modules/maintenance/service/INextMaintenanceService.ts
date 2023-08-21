import { EquipmentInstance } from "../../equipment/model/IEquipment";
import { NextMaintenanceInstance } from "../model/INextMaintenance";

export interface INextMaintenanceService {
	updateNextMaintenancesForEquipments(equipments: EquipmentInstance[]): Promise<NextMaintenanceInstance[]>;
	getAllNextMaintenances(): Promise<NextMaintenanceInstance[]>;
}

export const NextMaintenanceMessages = {
	NEXT_MAINTENANCE_NOT_FOUND: 'NEXT_MAINTENANCE_NOT_FOUND',
}

export const NUMBER_OF_MAINTENANCES_TO_CREATE = 10;