import { ISparePartService } from "modules/sparePart/service/ISparePartService";
import { IMaintenanceSparePartService, MaintenanceSparePartMessages } from "./IMaintenanceSparePartService";
import { IMaintenanceSparePartRepository } from "../repository/IMaintenanceSparePartRepository";
import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";
import { MaintenanceInstance } from "../model/IMaintenance";

export class MaintenanceSparePartService implements IMaintenanceSparePartService {
	private maintenanceSparePartRepository: IMaintenanceSparePartRepository;
	private sparePartService: ISparePartService;

	constructor(maintenanceSparePartRepository: IMaintenanceSparePartRepository, sparePartService: ISparePartService) {
		this.maintenanceSparePartRepository = maintenanceSparePartRepository;
		this.sparePartService = sparePartService;
	}

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