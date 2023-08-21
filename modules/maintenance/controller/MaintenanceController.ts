import { BaseController } from "../../interfaces/BaseController";
import { IMaintenanceController } from "./IMaintenanceController";
import { IMaintenanceService, MaintenanceMessages } from "../service/IMaintenanceService";
import { Request, Response } from "express";
import { MaintenanceCreationAttributes, MaintenanceInstance } from "../model/IMaintenance";
import { MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "../model/IMaintenanceSparePart";
import { NextMaintenanceInstance } from "../model/INextMaintenance";
import { INextMaintenanceService, NextMaintenanceMessages } from "../service/INextMaintenanceService";
import { container } from "tsyringe";
import { MaintenanceService } from "../service/MaintenanceService";
import { NextMaintenanceService } from "../service/NextMaintenanceService";
import i18n from 'i18n';

export class MaintenanceController extends BaseController implements IMaintenanceController {
	private maintenanceService: IMaintenanceService = container.resolve<IMaintenanceService>(MaintenanceService);
	private nextMaintenanceService: INextMaintenanceService = container.resolve<INextMaintenanceService>(NextMaintenanceService);

	public getMaintenancesList = async (req: Request, res: Response): Promise<Response<MaintenanceInstance[]>> => {
		try {
			const maintenances = await this.maintenanceService.getAllMaintenances();
			if (!maintenances) throw new Error(i18n.__(MaintenanceMessages.MAINTENANCE_NOT_FOUND));
			return res.status(200).json(maintenances);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(MaintenanceMessages.MAINTENANCE_NOT_FOUND));
		}
	}

	public postNewMaintenance = async (req: Request, res: Response): Promise<Response<MaintenanceInstance>> => {
		try {
			const maintenanceAttributes = this.parseMaintenanceFromBody(req);
			const maintenance = await this.maintenanceService.createMaintenance(maintenanceAttributes);
			if (!maintenance) throw new Error(i18n.__(MaintenanceMessages.ERROR_CREATING_MAINTENANCE));
			return res.status(200).json({
				message: i18n.__(MaintenanceMessages.MAINTENANCE_CREATED),
				maintenance: maintenance
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(MaintenanceMessages.ERROR_CREATING_MAINTENANCE));
		}
	}

	public getNextMaintenancesList = async (req: Request, res: Response): Promise<Response<NextMaintenanceInstance[]>> => {
		try {
			const nextMaintenances = await this.nextMaintenanceService.getAllNextMaintenances();
			if (!nextMaintenances) throw new Error(i18n.__(NextMaintenanceMessages.NEXT_MAINTENANCE_NOT_FOUND));
			return res.status(200).json(nextMaintenances);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(NextMaintenanceMessages.NEXT_MAINTENANCE_NOT_FOUND));
		}
	}

	private parseMaintenanceFromBody(req: Request): MaintenanceCreationAttributes {
		return {
			equipment_code: req.body.equipment_code,
			maintenance_frequency: req.body.maintenance_frequency,
			maintenance_duration: req.body.maintenance_duration || 0,
			maintenance_date: req.body.maintenance_date,
			maintenance_cost: req.body.maintenance_cost || 0,
			reset_equipment_partial_hours: req.body.reset_equipment_partial_hours || false,
			spare_parts: this.parseSparePartRowsFromBody(req)
		};
	}

	private parseSparePartRowsFromBody(req: Request): MaintenanceSparePartCreationAttributes[] {
		const spareParts: MaintenanceSparePartCreationAttributes[] = [];
		if (req.body.spare_parts) {
			for (const sparePart of req.body.spare_parts) {
				spareParts.push({
					spare_part_id: sparePart.spare_part_id,
					quantity: sparePart.quantity,
					application: sparePart.application,
					frequencies: sparePart.frequencies
				});
			}
		}
		return spareParts;
	}
}