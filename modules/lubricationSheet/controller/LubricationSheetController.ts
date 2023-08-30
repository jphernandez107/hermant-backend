import { BaseController } from "../../interfaces/BaseController";
import { ILubricationSheetController } from "./ILubricationSheetController";
import { ILubricationSheetService, LubricationSheetMessages } from "../service/ILubricationSheetService";
import { Request, Response } from "express";
import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { LubricationSheetSparePartCreationAttributes } from "../model/ILubricationSheetSparePart";
import { container } from "tsyringe";
import { LubricationSheetService } from "../service/LubricationSheetService";
import i18n from 'i18n';

export class LubricationSheetController extends BaseController implements ILubricationSheetController {
	private lubricationSheetService: ILubricationSheetService = container.resolve<ILubricationSheetService>(LubricationSheetService);

	public getLubricationSheetList = async (req: Request, res: Response): Promise<Response<LubricationSheetInstance[]>> => {
		try {
			const lubricationSheets = await this.lubricationSheetService.getAllLubricationSheets();
			if (!lubricationSheets) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheets);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public getLubricationSheetById = async (req: Request, res: Response): Promise<Response<LubricationSheetInstance>> => {
		try {
			const id: number = parseInt(req.query.id as string);
			const lubricationSheet = await this.lubricationSheetService.getLubricationSheetById(id);
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheet);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public getLubricationSheetByEquipmentCode = async (req: Request, res: Response): Promise<Response<LubricationSheetInstance>> => {
		try {
			const code: string = req.query.code as string || req.query.equipment_code as string;
			const lubricationSheet = await this.lubricationSheetService.getLubricationSheetByEquipmentCode(code);
			if (!lubricationSheet) throw new Error(i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
			return res.status(200).json(lubricationSheet);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_NOT_FOUND));
		}
	}

	public postNewLubricationSheet = async (req: Request, res: Response): Promise<Response<LubricationSheetInstance>> => {
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

	public deleteLubricationSheet = async (req: Request, res: Response): Promise<Response<void>> => {
		try {
			const id: number = parseInt(req.query.id as string);
			const lubricationSheet = await this.lubricationSheetService.deleteLubricationSheet(id);
			return res.status(200).json({
				message: i18n.__(LubricationSheetMessages.LUBRICATION_SHEET_DELETED),
			});
		} catch (error) {
			return this.catchError(res, 400, error, i18n.__(LubricationSheetMessages.ERROR_DELETING_LUBRICATION_SHEET));
		}
	}

	public addSparePartsToLubricationSheet = async (req: Request, res: Response): Promise<Response<LubricationSheetInstance>> => {
		try {
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
			id: req.body.lubrication_sheet_id,
			equipment_code: req.body.equipment_code,
			frequencies: req.body.frequencies,
			spare_parts: this.parseSparePartRowsFromBody(req),
		};
	}

	private parseSparePartRowsFromBody(req: Request): LubricationSheetSparePartCreationAttributes[] {
		const spareParts: LubricationSheetSparePartCreationAttributes[] = [];
		for (const sparePart of req.body.spare_parts) {
			spareParts.push({
				spare_part_id: sparePart.spare_part_id,
				application: sparePart.application,
				quantity: sparePart.quantity,
				raw_frequencies: sparePart.frequencies,
			});
		}
		return spareParts;
	}

}