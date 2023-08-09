import { Request, Response } from "express"
import { SparePartInstance } from "../model/ISparePart"

export interface ISparePartController { 
	getSparePartList(req: Request, res: Response): Promise<Response<SparePartInstance[]>>
	getSparePartByIdOrExternalCode(req: Request, res: Response): Promise<Response<SparePartInstance>>
	postNewSparePart(req: Request, res: Response): Promise<Response<SparePartInstance>>
	deleteSparePart(req: Request, res: Response): Promise<Response<void>>
	updateSparePart(req: Request, res: Response): Promise<Response<[number, SparePartInstance[]]>>
}