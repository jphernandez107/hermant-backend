import { Router } from 'express';
import { IConstructionSiteRoute } from './IConstructionSiteRoute';
import { UserRole, verifyRole } from '../../../middleware/jwtMiddleware';
import { IConstructionSiteController } from '../controller/IConstructionSiteController';
import { container } from 'tsyringe';
import { ConstructionSiteController } from '../controller/ConstructionSiteController';

export class ConstructionSiteRoute implements IConstructionSiteRoute {
	private constructionSiteController: IConstructionSiteController = container.resolve(ConstructionSiteController);;
	private role = UserRole.ENGINEER;

	configureRoutes(): Router {
		const router = Router();
		router.get('/list', verifyRole(UserRole.MECHANIC), this.constructionSiteController.getSitesList);
		router.get('/details', verifyRole(UserRole.MECHANIC), this.constructionSiteController.getSiteByIdOrCode);
		router.post('/new', verifyRole(this.role), this.constructionSiteController.postNewSite);
		router.delete('/delete', verifyRole(UserRole.ADMIN), this.constructionSiteController.deleteSite);
		router.put('/edit', verifyRole(this.role), this.constructionSiteController.updateSite);
		return router;
	}
}