import { MaintenanceInstance } from "../model/IMaintenance";
import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";

export interface IMaintenanceSparePartService {
	createMaintenanceSparePartsInBulk(MaintenanceSparePartAttributes: MaintenanceSparePartCreationAttributes[], maintenance: MaintenanceInstance): Promise<MaintenanceSparePartInstance[]>
}

export const MaintenanceSparePartMessages = {
	ERROR_CREATING_MAINTENANCE_SPARE_PARTS: 'ERROR_CREATING_MAINTENANCE_SPARE_PARTS'
}