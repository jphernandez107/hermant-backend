import { BaseController } from "modules/interfaces/BaseController";
import { ILubricationSheetController } from "./ILubricationSheetController";
import { ILubricationSheetService, LubricationSheetMessages } from "../service/ILubricationSheetService";
import { Request, Response } from "express";
import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { LubricationSheetSparePartCreationAttributes } from "../model/ILubricationSheetSparePart";

class LubricationSheetController extends BaseController implements ILubricationSheetController {
	private lubricationSheetService: ILubricationSheetService;

	constructor(lubricationSheetService: ILubricationSheetService) {
		super();
		this.lubricationSheetService = lubricationSheetService;
	}

	public async getLubricationSheetList(req: Request, res: Response): Promise<Response<LubricationSheetInstance[]>> {
		try {
			const lubricationSheets = await this.lubricationSheetService.getAllLubricationSheets();
			if (!lubricationSheets) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheets);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public async getLubricationSheetById(req: Request, res: Response): Promise<Response<LubricationSheetInstance>> {
		try {
			const id: number = parseInt(req.params.id);
			const lubricationSheet = await this.lubricationSheetService.getLubricationSheetById(id);
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheet);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public async getLubricationSheetByEquipmentCode(req: Request, res: Response): Promise<Response<LubricationSheetInstance>> {
		try {
			const code: string = req.params.code;
			const lubricationSheet = await this.lubricationSheetService.getLubricationSheetByEquipmentCode(code);
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheet);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public async postNewLubricationSheet(req: Request, res: Response): Promise<Response<LubricationSheetInstance>> {
		try {
			const lubricationSheet = await this.lubricationSheetService.createLubricationSheet();
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.ERROR_CREATING_LUBRICATION_SHEET));
			return res.status(200).json({
				message: i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_CREATED),
				lubricationSheet: lubricationSheet,
			});
		} catch (error) {
			return this.catchError(res, 400, error, i18n.__(LubricationSheetMessages.ERROR_CREATING_LUBRICATION_SHEET));
		}
	}

	public async deleteLubricationSheet(req: Request, res: Response): Promise<Response<void>> {
		try {
			const id: number = parseInt(req.params.id);
			const lubricationSheet = await this.lubricationSheetService.deleteLubricationSheet(id);
			return res.status(200).json({
				message: i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_DELETED),
			});
		} catch (error) {
			return this.catchError(res, 400, error, i18n.__(LubricationSheetMessages.ERROR_DELETING_LUBRICATION_SHEET));
		}
	}

	public async addSparePartsToLubricationSheet(req: Request, res: Response): Promise<Response<LubricationSheetInstance>> {
		try {
			const id: number = parseInt(req.params.id);
			const lubricationSheetAttributes = this.parseLubricationSheetFromBody(req);
			const lubricationSheet = await this.lubricationSheetService.addSparePartsToLubricationSheet(lubricationSheetAttributes);
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.ERROR_CREATING_LUBRICATION_SHEET));
			return res.status(201).json({
				message: i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_CREATED),
				lubricationSheet: lubricationSheet,
			});
		} catch (error) {
			return this.catchError(res, 400, error, i18n.__(LubricationSheetMessages.ERROR_CREATING_LUBRICATION_SHEET));
		}
	}

	private parseLubricationSheetFromBody(req: Request): LubricationSheetCreationAttributes {
		return {
			equipment_code: req.body.equipment_code,
			frequencies: req.body.frequencies,
			spare_parts: this.parseSparePartRowsFromBody(req),
		};
	}

	private parseSparePartRowsFromBody(req: Request): LubricationSheetSparePartCreationAttributes[] {
		const spareParts: LubricationSheetSparePartCreationAttributes[] = [];
		for (const sparePart of req.body.spare_parts) {
			spareParts.push({
				spare_part_id: sparePart.sparePartId,
				application: sparePart.application,
				quantity: sparePart.quantity,
				frequencies: sparePart.frequencies,
			});
		}
		return spareParts;
	}

}