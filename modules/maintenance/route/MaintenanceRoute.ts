import { Router } from "express";
import { verifyRole, UserRole } from "../../..//middleware/jwtMiddleware";
import { IMaintenanceController } from "../controller/IMaintenanceController";
import { IMaintenanceRoute } from "./IMaintenanceRoute";

export class MaintenanceRoute implements IMaintenanceRoute {
	private maintenanceController: IMaintenanceController;
	private role = UserRole.MECHANIC

	constructor(maintenanceController: IMaintenanceController) {
		this.maintenanceController = maintenanceController;
	}

	public configureRoutes(router: Router): void {
		router.route("/new").post(verifyRole(this.role), this.maintenanceController.postNewMaintenance);
		router.route("/next-maintenances").get(verifyRole(this.role), this.maintenanceController.getNextMaintenancesList);
	}
}