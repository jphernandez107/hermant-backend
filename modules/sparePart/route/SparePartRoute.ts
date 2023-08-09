import { Router } from "express";
import { ISparePartController } from "../controller/ISparePartController";
import { ISparePartRoute } from "./ISparePartRoute";
import { verifyRole, UserRole } from "../../..//middleware/jwtMiddleware";


class SparePartRoute implements ISparePartRoute {
	private sparePartController: ISparePartController;
	private role = UserRole.MECHANIC;

	constructor(sparePartController: ISparePartController) {
		this.sparePartController = sparePartController;
	}

	configureRoutes(router: Router): void {
		router.get('/list', verifyRole(this.role), this.sparePartController.getSparePartList);
		router.get('/details', verifyRole(this.role), this.sparePartController.getSparePartByIdOrExternalCode);
		router.post('/new', verifyRole(UserRole.ENGINEER), this.sparePartController.postNewSparePart);
		router.delete('/delete', verifyRole(UserRole.ADMIN), this.sparePartController.deleteSparePart);
		router.put('/edit', verifyRole(UserRole.ENGINEER), this.sparePartController.updateSparePart);
	}
}