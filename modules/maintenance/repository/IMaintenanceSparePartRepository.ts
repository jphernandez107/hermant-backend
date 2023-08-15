import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";

export interface IMaintenanceSparePartRepository {
	getAllMaintenanceSpareParts(): Promise<MaintenanceSparePartInstance[]>;
	getMaintenanceSparePartById(id: number): Promise<MaintenanceSparePartInstance | null>;
	createMaintenanceSparePart(maintenanceAttributes: MaintenanceSparePartCreationAttributes): Promise<MaintenanceSparePartInstance>;
	createMaintenanceSparePartsInBulk(maintenanceSparePartAttributes: MaintenanceSparePartCreationAttributes[]): Promise<MaintenanceSparePartInstance[]>;
}