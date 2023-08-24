import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";

export interface IMaintenanceRepository {
	getAllMaintenances(): Promise<MaintenanceInstance[]>;
	getMaintenanceById(id: number): Promise<MaintenanceInstance | null>;
	getMaintenancesByEquipmentCode(equipmentCode: string): Promise<MaintenanceInstance[]>;
	createMaintenance(maintenanceAttributes: MaintenanceCreationAttributes): Promise<MaintenanceInstance>;
	saveMaintenance(maintenance: MaintenanceInstance): Promise<MaintenanceInstance>;
	deleteMaintenance(maintenance: MaintenanceInstance): Promise<void>;
}

export const MaintenanceIncludes = [
	{
		association: 'equipment'
	},
	{
		association: 'maintenance_spare_parts',
		include: [
			{
				association: 'spare_part'
			}
		]
	},
	{
		association: 'maintenance_frequency'
	}
];