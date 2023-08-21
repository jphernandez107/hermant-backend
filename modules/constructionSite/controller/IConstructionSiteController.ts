import { Request, Response } from 'express';
import { ConstructionSiteInstance } from '../model/IConstructionSite';

export interface IConstructionSiteController {
	getSitesList(req: Request, res: Response): Promise<Response<ConstructionSiteInstance[]>>;
	getSiteByIdOrCode(req: Request, res: Response): Promise<Response<ConstructionSiteInstance>>;
	postNewSite(req: Request, res: Response): Promise<Response<ConstructionSiteInstance>>;
	deleteSite(req: Request, res: Response): Promise<Response<number>>;
	updateSite(req: Request, res: Response): Promise<Response<[number, ConstructionSiteInstance[]]>>;
}
