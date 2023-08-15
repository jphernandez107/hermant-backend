import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";
import { MaintenanceSparePart } from "../model/MaintenanceSparePart";
import { IMaintenanceSparePartRepository } from "./IMaintenanceSparePartRepository";

export class MaintenanceSparePartRepository implements IMaintenanceSparePartRepository {
	public async getAllMaintenanceSpareParts(): Promise<MaintenanceSparePartInstance[]> {
		return MaintenanceSparePart.findAll();
	}
	public async getMaintenanceSparePartById(id: number): Promise<MaintenanceSparePartInstance | null> {
		return MaintenanceSparePart.findByPk(id);
	}
	public async createMaintenanceSparePart(maintenanceAttributes: MaintenanceSparePartCreationAttributes): Promise<MaintenanceSparePartInstance> {
		return MaintenanceSparePart.create(maintenanceAttributes);
	}
	public async createMaintenanceSparePartsInBulk(maintenanceSparePartAttributes: MaintenanceSparePartCreationAttributes[]): Promise<MaintenanceSparePartInstance[]> {
		return MaintenanceSparePart.bulkCreate(maintenanceSparePartAttributes);
	}
}