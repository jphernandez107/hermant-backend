import { Router } from 'express';
import { IUserRoute } from './IUserRoute';
import { verifyRole, UserRole } from '../../../middleware/jwtMiddleware';
import { IUserController } from '../controller/IUserController';

export class UserRoute implements IUserRoute {
	private userController: IUserController;
	private role = UserRole.ADMIN;

	constructor(userController: IUserController) {
		this.userController = userController;
	}

	configureRoutes(router: Router): void {
		router.get('/list', verifyRole(this.role), this.userController.getUsersList);
		router.post('/register', verifyRole(this.role), this.userController.createUser);
		router.put('/:id', verifyRole(this.role), this.userController.updateUser);
		router.delete('/:id', verifyRole(this.role), this.userController.deleteUser);
		router.post('/signin', this.userController.loginUser);
		router.put('/:id/activate', verifyRole(this.role), this.userController.activateUser);
		router.put('/:id/deactivate', verifyRole(this.role), this.userController.deactivateUser);
	}
}
