import { Router } from "express";
import { ISparePartController } from "../controller/ISparePartController";
import { ISparePartRoute } from "./ISparePartRoute";
import { verifyRole, UserRole } from "../../../middleware/jwtMiddleware";
import { container } from "tsyringe";
import { SparePartController } from "../controller/SparePartController";


export class SparePartRoute implements ISparePartRoute {
	private sparePartController: ISparePartController = container.resolve(SparePartController);
	private role = UserRole.MECHANIC;

	configureRoutes(): Router {
		const router = Router();
		router.get('/list', verifyRole(this.role), this.sparePartController.getSparePartList);
		router.get('/details', verifyRole(this.role), this.sparePartController.getSparePartByIdOrExternalCode);
		router.post('/new', verifyRole(UserRole.ENGINEER), this.sparePartController.postNewSparePart);
		router.delete('/delete', verifyRole(UserRole.ADMIN), this.sparePartController.deleteSparePart);
		router.put('/edit', verifyRole(UserRole.ENGINEER), this.sparePartController.updateSparePart);
		return router;
	}
}