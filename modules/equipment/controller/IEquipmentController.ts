import { Request, Response } from 'express';
import { EquipmentInstance } from '../model/IEquipment';

export interface IEquipmentController {
	getEquipmentsList(req: Request, res: Response): Promise<Response<EquipmentInstance[]>>;
	getEquipmentByIdOrCode(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
	postNewEquipment(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
	deleteEquipment(req: Request, res: Response): Promise<Response<number>>;
	updateEquipment(req: Request, res: Response): Promise<Response<[number]>>;
	addUseHoursInBulk(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
	addLubricationSheetToEquipment(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
	addEquipmentToSite(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
	removeEquipmentFromSite(req: Request, res: Response): Promise<Response<EquipmentInstance>>;
}