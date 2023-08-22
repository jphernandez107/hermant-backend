import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IConstructionSiteController } from './IConstructionSiteController';
import { IConstructionSiteService, ConstructionSiteMessages } from '../service/IConstructionSiteService';
import { ConstructionSiteCreationAttributes, ConstructionSiteInstance } from '../model/IConstructionSite';
import { BaseController } from '../../interfaces/BaseController';
import { ConstructionSiteService } from '../service/ConstructionSiteService';
import i18n from 'i18n';

export class ConstructionSiteController extends BaseController implements IConstructionSiteController {
	private service: IConstructionSiteService = container.resolve<IConstructionSiteService>(ConstructionSiteService);

	public getSitesList = async (req: Request, res: Response): Promise<Response<ConstructionSiteInstance[]>> => {
		try {
			const sites = await this.service.getAllSites();
			if (!sites) throw new Error(i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
			return res.status(200).json(sites);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
		}
	}

	public getSiteByIdOrCode = async (req: Request, res: Response): Promise<Response<ConstructionSiteInstance>> => {
		try {
			const site = await this.findSiteByIdOrCode(req);
			if (!site) throw new Error(i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
			return res.status(200).json(site);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
		}
	}

	postNewSite = async (req: Request, res: Response): Promise<Response<ConstructionSiteInstance>> => {
		try {
			const siteAttributes = this.parseSiteFromBody(req);
			const site = await this.service.createSite(siteAttributes);
			if (!site) throw new Error(i18n.__(ConstructionSiteMessages.ERROR_CREATING_SITE));
			return res.status(200).json({ 
				message: i18n.__(ConstructionSiteMessages.SITE_CREATED), 
				site: site 
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(ConstructionSiteMessages.ERROR_CREATING_SITE));
		}
	}

	deleteSite = async (req: Request, res: Response): Promise<Response<number>> => {
		try {
			const id = req.body.id as number || null;
			const code = req.body.code as string || null;
			await this.service.deleteSite(id, code);
			return res.status(200).json({ 
				message: i18n.__(ConstructionSiteMessages.SITE_DELETED) 
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(ConstructionSiteMessages.ERROR_DELETING_SITE));
		}
	}

	updateSite = async (req: Request, res: Response): Promise<Response<[number, ConstructionSiteInstance]>> => {
		try {
			const siteAttributes = this.parseSiteFromBody(req, false);
			const id: number = Number.parseInt(req.query.id as string);
			const site = await this.service.updateSite(id, siteAttributes);
			if (!site || site[0] === 0) throw new Error(i18n.__(ConstructionSiteMessages.ERROR_UPDATING_SITE));
			return res.status(200).json({ 
				message: i18n.__(ConstructionSiteMessages.SITE_UPDATED), 
				site: site[1] 
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(ConstructionSiteMessages.ERROR_UPDATING_SITE));
		}
	}

	public findSiteByIdOrCode = async (req: Request): Promise<ConstructionSiteInstance | null> => {
		let id: number | null = null;
		let code: string | null = null;

		if (typeof req.query.id === 'string' || typeof req.query.id === 'number') {
			id = Number.parseInt(req.query.id);
		} else if (typeof req.query.site_id === 'string' || typeof req.query.site_id === 'number') {
			id = Number.parseInt(req.query.site_id);
		}

		if (typeof req.query.code === 'string') {
			code = req.query.code;
		} else if (typeof req.query.site_code === 'string') {
			code = req.query.site_code;
		}

		return await this.service.getSiteByIdOrCode(id, code);
	}

	private parseSiteFromBody = (req: Request, isCreating: boolean = true): ConstructionSiteCreationAttributes => {
		const {
			code,
			name,
			district,
			province,
			init_date,
			finish_date,
			max_temp,
			min_temp,
			altitude,
			dust,
			distance,
			observations,
		} = req.body;
	
		// Check for required fields
		if (isCreating && (!code || !name)) {
			throw Error('Missing required attributes');
		}
	
		const siteAttributes: ConstructionSiteCreationAttributes = {
			code: code,
			name: name,
			district: district || null,
			province: province || null,
			init_date: init_date || null,
			finish_date: finish_date || null,
			max_temp: max_temp || 0,
			min_temp: min_temp || 0,
			altitude: altitude || 0,
			dust: dust || 0,
			distance: distance || 0,
			observations: observations || "",
		};
	
		return siteAttributes;
	};
}