import { Router } from "express";
import { verifyRole, UserRole } from "../../..//middleware/jwtMiddleware";
import { ILubricationSheetController } from "../controller/ILubricationSheetController";
import { LubricationSheetController } from "../controller/LubricationSheetController";
import { ILubricationSheetRoute } from "./ILubricationSheetRoute";
import { container } from "tsyringe";

export class LubricationSheetRoute implements ILubricationSheetRoute {
	private lubricationSheetController: ILubricationSheetController = container.resolve(LubricationSheetController)
	private role = UserRole.MECHANIC;

	configureRoutes(): Router {
		const router = Router();
		router.get('/list', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetList);
		router.get('/details', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetById);
		router.get('/equipment', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetByEquipmentCode);
		router.post('/new', verifyRole(UserRole.ENGINEER), this.lubricationSheetController.postNewLubricationSheet);
		router.delete('/delete', verifyRole(UserRole.ADMIN), this.lubricationSheetController.deleteLubricationSheet);
		router.post('/sparepart/add', verifyRole(UserRole.ENGINEER), this.lubricationSheetController.addSparePartsToLubricationSheet);
		return router;
	}
}