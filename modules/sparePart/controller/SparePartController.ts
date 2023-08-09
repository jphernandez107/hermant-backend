import { BaseController } from "modules/interfaces/BaseController";
import { ISparePartController } from "./ISparePartController";
import { ISparePartService, SparePartMessages } from "../service/ISparePartService";
import { Request, Response } from "express";
import { SparePartCreationAttributes, SparePartInstance } from "../model/ISparePart";

class SparePartController extends BaseController implements ISparePartController {
	private sparePartService: ISparePartService;

	constructor(sparePartService: ISparePartService) {
		super();
		this.sparePartService = sparePartService;
	}

	public async getSparePartList(req: Request, res: Response): Promise<Response<SparePartInstance[]>> {
		try {
			const spareParts = await this.sparePartService.getAllSpareParts();
			if (!spareParts) throw new Error(i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
			return res.status(200).json(spareParts);
		} catch (error) {
			return this.catchError(res, error, 404, i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
		}
	}
	public async getSparePartByIdOrExternalCode(req: Request, res: Response): Promise<Response<SparePartInstance>> {
		try {
			const { id, externalCode } = req.params;
			const sparePart = await this.findSparePartByIdOrExternalCode(req);
			if (!sparePart) throw new Error(i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
			return res.status(200).json(sparePart);
		} catch (error) {
			return this.catchError(res, error, 404, i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
		}
	}
	public async postNewSparePart(req: Request, res: Response): Promise<Response<SparePartInstance>> {
		try {
			const sparePartAttributes = this.parseSparePartFromBody(req);
			const sparePart = await this.sparePartService.createSparePart(sparePartAttributes);
			if (!sparePart) throw new Error(i18n.__(SparePartMessages.ERROR_CREATING_SPARE_PART));
			return res.status(200).json({
				message: i18n.__(SparePartMessages.SPARE_PART_CREATED),
				sparePart: sparePart
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(SparePartMessages.ERROR_CREATING_SPARE_PART));
		}
	}
	public async deleteSparePart(req: Request, res: Response): Promise<Response<void>> {
		try {
			const id = parseInt(req.params.id) || null;
			const externalCode = req.params.externalCode as string || null;
			await this.sparePartService.deleteSparePart(id, externalCode);
			return res.status(200).json({
				message: i18n.__(SparePartMessages.SPARE_PART_DELETED),
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(SparePartMessages.ERROR_DELETING_SPARE_PART));
		}
	}
	public async updateSparePart(req: Request, res: Response): Promise<Response<[number, SparePartInstance[]]>> {
		try {
			const equipmentAttributes = this.parseSparePartFromBody(req, false);
			const id = parseInt(req.params.id) || null;
			const spareParts = await this.sparePartService.updateSparePart(id, equipmentAttributes);
			if (!spareParts || spareParts[0] === 0) throw new Error(i18n.__(SparePartMessages.ERROR_UPDATING_SPARE_PART));
			return res.status(200).json({
				message: i18n.__(SparePartMessages.SPARE_PART_UPDATED),
				sparePart: spareParts[1]
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(SparePartMessages.ERROR_UPDATING_SPARE_PART));
		}
	}

	private async findSparePartByIdOrExternalCode(req: Request): Promise<SparePartInstance | null> {
		let id: number | null = null;
		let external_code: string | null = null;

		if (typeof req.query.id === 'string' || typeof req.query.id === 'number') {
			id = parseInt(req.query.id);
		} else if (typeof req.query.spare_part_id === 'string' || typeof req.query.spare_part_id === 'number') {
			id = parseInt(req.query.spare_part_id);
		}

		if (typeof req.query.code === 'string') {
			external_code = req.query.code;
		} else if (typeof req.query.spare_part_external_code === 'string') {
			external_code = req.query.spare_part_external_code;
		}

		return await this.sparePartService.getSparePartByIdOrExternalCode(id, external_code);
	}

	private parseSparePartFromBody(req: Request, isCreating: boolean = true): SparePartCreationAttributes {
		const {
			internal_code,
			external_code,
			type,
			application,
			brand,
			model,
			stock,
			unit_price,
			detail_link,
			observations,
		} = req.body;
	
		// Check for required fields
		if (isCreating && (!internal_code || !external_code || !type || !application || !brand || !model)) {
			throw Error('Missing required attributes');
		}
	
		const equipmentAttributes: SparePartCreationAttributes = {
			internal_code: internal_code,
			external_code: external_code,
			type: type,
			application: application,
			brand: brand,
			model: model,
			stock: stock || 0,
			unit_price: unit_price || null,
			detail_link: detail_link || null,
			observations: observations || null,
		};
	
		return equipmentAttributes;
	}
}