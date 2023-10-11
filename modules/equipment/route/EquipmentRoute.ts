import { Router } from 'express';
import { IEquipmentRoute } from './IEquipmentRoute';
import { UserRole, verifyRole } from '../../../middleware/jwtMiddleware';
import { IEquipmentController } from '../controller/IEquipmentController';
import EquipmentController from '../controller/EquipmentController';
import { container } from 'tsyringe';

export class EquipmentRoute implements IEquipmentRoute {
	private equipmentController: IEquipmentController = container.resolve(EquipmentController);
	private role = UserRole.ENGINEER;
	
	configureRoutes(): Router {
		const router = Router();
		router.get("/list", verifyRole(UserRole.MECHANIC), this.equipmentController.getEquipmentsList);
		router.get("/details", verifyRole(UserRole.MECHANIC), this.equipmentController.getEquipmentByIdOrCode);
		router.post("/new", verifyRole(this.role), this.equipmentController.postNewEquipment);
		router.delete("/delete", verifyRole(UserRole.ADMIN), this.equipmentController.deleteEquipment);
		router.put("/edit", verifyRole(this.role), this.equipmentController.updateEquipment);
		router.post("/hours/bulk", verifyRole(this.role), this.equipmentController.addUseHoursInBulk);
		router.put("/lubricationsheet/add", verifyRole(this.role), this.equipmentController.addLubricationSheetToEquipment);
		router.put('/site/add', verifyRole(this.role), this.equipmentController.addEquipmentToSite);
		router.put('/site/remove', verifyRole(this.role), this.equipmentController.removeEquipmentFromSite);
		router.get("/hours", verifyRole(this.role), this.equipmentController.getEquipmentHoursByEquipment);
		return router;
	}
}