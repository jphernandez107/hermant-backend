import { inject, injectable, singleton } from "tsyringe";
import { ISparePartService } from "../../sparePart/service/ISparePartService";
import { IMaintenanceSparePartService, MaintenanceSparePartMessages } from "./IMaintenanceSparePartService";
import { IMaintenanceSparePartRepository } from "../repository/IMaintenanceSparePartRepository";
import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";
import { MaintenanceInstance } from "../model/IMaintenance";
import { MaintenanceSparePartRepository } from "../repository/MaintenanceSparePartRepository";
import { SparePartService } from "../../sparePart/service/SparePartService";
import i18n from 'i18n';

@singleton()
@injectable()
export class MaintenanceSparePartService implements IMaintenanceSparePartService {
	
	constructor(
		@inject(MaintenanceSparePartRepository) private maintenanceSparePartRepository: IMaintenanceSparePartRepository,
		@inject(SparePartService) private sparePartService: ISparePartService
	) {}

	public async createMaintenanceSparePartsInBulk(maintenanceSparePartAttributes: MaintenanceSparePartCreationAttributes[], maintenance: MaintenanceInstance): Promise<MaintenanceSparePartInstance[]> {
		const sparePartsWithCosts = await this.getPartialCostForRow(maintenanceSparePartAttributes);
		this.fillMaintenanceSparePartAttributes(sparePartsWithCosts, maintenance);
		const maintenanceSpareParts = await this.maintenanceSparePartRepository.createMaintenanceSparePartsInBulk(sparePartsWithCosts);
		if (!maintenanceSpareParts) throw new Error(MaintenanceSparePartMessages.ERROR_CREATING_MAINTENANCE_SPARE_PARTS);
		return maintenanceSpareParts;
	}

	private async getPartialCostForRow(sparePartsAttributes: MaintenanceSparePartCreationAttributes[]): Promise<MaintenanceSparePartCreationAttributes[]> {
		const spareParts = await this.sparePartService.getAllSpareParts();
		return sparePartsAttributes.map(item => {
			const sparePart = spareParts.find(sp => sp.id === item.spare_part_id);
			if (sparePart) item.partial_cost = sparePart.unit_price * item.quantity;
			else item.partial_cost = 0;
			return item;
		});
	}

	private fillMaintenanceSparePartAttributes(maintenanceSparePartAttributes: MaintenanceSparePartCreationAttributes[], maintenance: MaintenanceInstance): void {
		maintenanceSparePartAttributes.forEach(item => {
			item.maintenance_id = maintenance.id;
		});
	}
}