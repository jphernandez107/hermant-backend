import { Router } from "express";
import { verifyRole, UserRole } from "../../..//middleware/jwtMiddleware";
import { ILubricationSheetController } from "../controller/ILubricationSheetController";
import { ILubricationSheetRoute } from "./ILubricationSheetRoute";

class LubricationSheetRoute implements ILubricationSheetRoute {
	private lubricationSheetController: ILubricationSheetController;
	private role = UserRole.MECHANIC;

	constructor(lubricationSheetController: ILubricationSheetController) {
		this.lubricationSheetController = lubricationSheetController;
	}

	configureRoutes(router: Router): void {
		router.get('/list', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetList);
		router.get('/details', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetById);
		router.get('/equipment', verifyRole(this.role), this.lubricationSheetController.getLubricationSheetByEquipmentCode);
		router.post('/new', verifyRole(UserRole.ENGINEER), this.lubricationSheetController.postNewLubricationSheet);
		router.delete('/delete', verifyRole(UserRole.ADMIN), this.lubricationSheetController.deleteLubricationSheet);
		router.post('/sparepart/add', verifyRole(UserRole.ENGINEER), this.lubricationSheetController.addSparePartsToLubricationSheet);
	}
}