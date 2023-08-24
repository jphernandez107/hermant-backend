import { Request, Response } from "express";
import { MaintenanceInstance } from "../model/IMaintenance";
import { NextMaintenanceInstance } from "../model/INextMaintenance";

export interface IMaintenanceController {
	getMaintenancesList(req: Request, res: Response): Promise<Response<MaintenanceInstance[]>>;
	postNewMaintenance(req: Request, res: Response): Promise<Response<MaintenanceInstance>>;
	getNextMaintenancesList(req: Request, res: Response): Promise<Response<NextMaintenanceInstance[]>>;
}