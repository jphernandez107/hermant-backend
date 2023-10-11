import e, { Request, Response } from 'express';
import { IEquipmentController } from "./IEquipmentController";
import { IEquipmentService, EquipmentMessages } from "../service/IEquipmentService";
import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentHourCreationInBulkAttributes, EquipmentHourCreationInBulkItemAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';
import { BaseController } from '../../interfaces/BaseController';
import { EquipmentService } from '../service/EquipmentService';
import { autoInjectable, inject } from 'tsyringe';
import i18n from 'i18n';

@autoInjectable()
export default class EquipmentController extends BaseController implements IEquipmentController {

	constructor(
		@inject(EquipmentService) private equipmentService: IEquipmentService
	) {
		super();
	}

	public getEquipmentsList = async (req: Request, res: Response): Promise<Response<EquipmentInstance[]>> => {
		try {
			const equipments = await this.equipmentService.getAllEquipments();
			if (!equipments) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			return res.status(200).json(equipments);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		}
	}
	public getEquipmentByIdOrCode = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			return res.status(200).json(equipment);
		} catch (error) {
			return this.catchError(res, 404, error, i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		}
	}
	public postNewEquipment = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const equipmentAttributes = this.parseEquipmentFromBody(req);
			const equipment = await this.equipmentService.createEquipment(equipmentAttributes);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.ERROR_CREATING_EQUIPMENT));
			return res.status(200).json({
				message: this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_CREATED, equipment),
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_CREATING_EQUIPMENT));
		}
	}
	public deleteEquipment = async (req: Request, res: Response): Promise<Response<number>> => {
		try {
			const id = parseInt(req.query.id as string) || null;
			const code = req.query.code as string || null;
			const equipment = await this.equipmentService.deleteEquipment(id, code);
			return res.status(200).json({
				message: this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_DELETED, equipment),
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_DELETING_EQUIPMENT));
		}
	}
	public updateEquipment = async (req: Request, res: Response): Promise<Response<[number]>> => {
		try {
			const equipmentAttributes = this.parseEquipmentFromBody(req, false);
			const id: number = Number.parseInt(req.query.id as string)
			const code = req.query.code as string || null;
			const equipments = await this.equipmentService.updateEquipment(id, code, equipmentAttributes);
			if (!equipments || !equipments[0] || equipments[0] === 0) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			return res.status(200).json({
				message: this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_UPDATED, equipments[1]),
				equipment: equipments[1],
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_UPDATING_EQUIPMENT));
		}
	}
	public addUseHoursInBulk = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const result = await this.equipmentService.addEquipmentHoursInBulk(this.parseEquipmentHourInBulkFromBody(req));
			return res.status(result.statusCode).json({
				message: result.message,
				equipments: result.equipments,
				errors: result.errors,
				equipment_hours_added: result.equipmentHoursAdded
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_ADDING_HOURS));
		}
	}
	public addLubricationSheetToEquipment = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			await this.equipmentService.addLubricationSheetToEquipment(equipment, req.body.lubrication_sheet_id);
			const message = this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_ADDED_TO_LUBRICATION_SHEET, equipment);
			return res.status(200).json({
				message: message,
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_ADDING_LUBRICATION_SHEET));
		}
	}
	public addEquipmentToSite = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			const site = await this.equipmentService.addEquipmentToSite(equipment, req.body.construction_site_id, req.body.construction_site_code);
			const equipments = await this.equipmentService.getAllEquipments();
			const message = this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_ADDED_TO_SITE, equipment);
			return res.status(200).json({
				message: message,
				site: site,
				equipment: equipment,
				all_equipments: equipments
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_ADDING_EQUIPMENT_TO_SITE));
		}
	}
	public removeEquipmentFromSite = async (req: Request, res: Response): Promise<Response<EquipmentInstance>> => {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			const site = await this.equipmentService.removeEquipmentFromSite(equipment, req.body.construction_site_id, req.body.construction_site_code);
			const message = this.getEquipmentMessage(EquipmentMessages.EQUIPMENT_REMOVED_FROM_SITE, equipment);
			return res.status(200).json({
				message: message,
				site: site,
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_REMOVING_EQUIPMENT_FROM_SITE));
		}
	}

	public getEquipmentHoursByEquipment = async (req: Request, res: Response): Promise<Response<EquipmentHourInstance[]>> => {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			const equipmentHours = await this.equipmentService.getEquipmentHoursByEquipmentId(equipment.id);
			return res.status(200).json(equipmentHours);
		} catch (error) {
			return this.catchError(res, 500, error, i18n.__(EquipmentMessages.ERROR_FETCHING_EQUIPMENT_HOURS));
		}
	}

	public findEquipmentByIdOrCode = async (req: Request): Promise<EquipmentInstance | null> => {
		let id: number | null = null;
		let code: string | null = null;

		if (typeof req.query.id === 'string' || typeof req.query.id === 'number') {
			id = Number.parseInt(req.query.id);
		} else if (typeof req.query.equipment_id === 'string' || typeof req.query.equipment_id === 'number') {
			id = Number.parseInt(req.query.equipment_id);
		} else if (typeof req.body.equipment_id === 'string' || typeof req.body.equipment_id === 'number') {
			id = Number.parseInt(req.body.equipment_id);
		}

		if (typeof req.query.code === 'string') {
			code = req.query.code;
		} else if (typeof req.query.equipment_code === 'string') {
			code = req.query.equipment_code;
		} else if (typeof req.body.equipment_code === 'string') {
			code = req.body.equipment_code;
		}

		return await this.equipmentService.getEquipmentByIdOrCode(id, code);
	}

	private parseEquipmentFromBody = (req: Request, isCreating: boolean = true): EquipmentCreationAttributes => {
		const {
			code,
			brand,
			model,
			designation,
			total_hours,
			partial_hours,
			serial_number,
			origin,
			manuf_date,
			service_date,
			power,
			weight,
			price,
			observations,
			site_importance,
			construction_site_id,
			lubrication_sheet_id
		} = req.body;
	
		// Check for required fields
		if (isCreating && (!code || !brand || !model || !designation)) {
			throw Error('Missing required attributes');
		}
	
		const equipmentAttributes: EquipmentCreationAttributes = {
			code: code,
			brand: brand,
			model: model,
			designation: designation,
			total_hours: total_hours,
			partial_hours: partial_hours,
			serial_number: serial_number ,
			origin: origin ,
			manuf_date: manuf_date ? new Date(manuf_date) : null,
			service_date: service_date ? new Date(service_date) : null,
			power: power ,
			weight: weight ,
			price: price,
			observations: observations,
			site_importance: site_importance ,
			construction_site_id: construction_site_id,
			lubrication_sheet_id: lubrication_sheet_id,
		};
	
		return equipmentAttributes;
	};

	private parseEquipmentHourInBulkFromBody = (req: Request): EquipmentHourCreationInBulkAttributes => {

		const hours = this.parseEquipmentHourInBulkItemFromBody(req.body.hours);
		const startDate = new Date(req.body.start_date);
		const endDate = new Date(req.body.end_date);
		const user_id = req.body.user_id;

		// Check for required fields
		if (!hours || !startDate || !endDate || !user_id) {
			throw Error(i18n.__(EquipmentMessages.INVALID_INPUT));
		}
	
		const equipmentHourAttributes: EquipmentHourCreationInBulkAttributes = {
			hours: hours,
			start_date: startDate,
			end_date: endDate,
			user_id: user_id,
		};
	
		return equipmentHourAttributes;
	};

	private parseEquipmentHourInBulkItemFromBody = (hours: any[]): EquipmentHourCreationInBulkItemAttributes[] => {
		return hours.map((item: any): EquipmentHourCreationInBulkItemAttributes => ({
			hours: item.hours,
			code: item.code
		}));
	}

	private getEquipmentMessage = (message: string, equipment: EquipmentInstance): string => {
		return i18n.__(message, {
			equipment: `${equipment.designation} ${equipment.brand} ${equipment.model} ${equipment.code}`
		});
	}
}