import { Request, Response } from "express";
import { LubricationSheetInstance } from "../model/ILubricationSheet";

export interface ILubricationSheetController {
	getLubricationSheetList(req: Request, res: Response): Promise<Response<LubricationSheetInstance[]>>
	getLubricationSheetById(req: Request, res: Response): Promise<Response<LubricationSheetInstance>>
	getLubricationSheetByEquipmentCode(req: Request, res: Response): Promise<Response<LubricationSheetInstance>>
	postNewLubricationSheet(req: Request, res: Response): Promise<Response<LubricationSheetInstance>>
	deleteLubricationSheet(req: Request, res: Response): Promise<Response<void>>
	addSparePartsToLubricationSheet(req: Request, res: Response): Promise<Response<LubricationSheetInstance>>
}