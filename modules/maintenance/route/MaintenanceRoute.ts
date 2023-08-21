import { Router } from "express";
import { verifyRole, UserRole } from "../../..//middleware/jwtMiddleware";
import { IMaintenanceController } from "../controller/IMaintenanceController";
import { IMaintenanceRoute } from "./IMaintenanceRoute";
import { container } from "tsyringe";
import { MaintenanceController } from "../controller/MaintenanceController";

export class MaintenanceRoute implements IMaintenanceRoute {
	private maintenanceController: IMaintenanceController = container.resolve(MaintenanceController);
	private role = UserRole.MECHANIC

	public configureRoutes(): Router {
		const router = Router();
		router.route("/new").post(verifyRole(this.role), this.maintenanceController.postNewMaintenance);
		router.route("/next-maintenances").get(verifyRole(this.role), this.maintenanceController.getNextMaintenancesList);
		return router;
	}
}