import { Request, Response } from 'express';
import { IEquipmentController } from "./IEquipmentController";
import { IEquipmentService, EquipmentMessages } from "../service/IEquipmentService";
import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentHourCreationInBulkAttributes, EquipmentHourCreationInBulkItemAttributes } from '../model/IEquipmentHour';
import { BaseController } from 'modules/interfaces/BaseController';

class EquipmentController extends BaseController implements IEquipmentController {
	private equipmentService: IEquipmentService;
  
	constructor(equipmentService: IEquipmentService) {
		super();
	  	this.equipmentService = equipmentService;
	}
  
	public async getEquipmentsList (req: Request, res: Response): Promise<Response<EquipmentInstance[]>> {
		try {
			const equipments = await this.equipmentService.getAllEquipments();
			if (!equipments) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			return res.status(200).json(equipments);
		} catch (error) {
			return this.catchError(res, error, 404, i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		}
	}
	public async getEquipmentByIdOrCode(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			return res.status(200).json(equipment);
		} catch (error) {
			return this.catchError(res, error, 404, i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
		}
	}
	public async postNewEquipment(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		try {
			const equipmentAttributes = this.parseEquipmentFromBody(req);
			const equipment = await this.equipmentService.createEquipment(equipmentAttributes);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.ERROR_CREATING_EQUIPMENT));
			return res.status(200).json({
				message: this.getEquipmentMessage(i18n.__(EquipmentMessages.EQUIPMENT_CREATED), equipment),
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_CREATING_EQUIPMENT));
		}
	}
	public async deleteEquipment(req: Request, res: Response): Promise<Response<number>> {
		try {
			const id = req.body.id as number || null;
			const code = req.body.code as string || null;
			await this.equipmentService.deleteEquipment(id, code);
			return res.status(200).json({
				message: i18n.__(EquipmentMessages.EQUIPMENT_DELETED),
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_DELETING_EQUIPMENT));
		}
	}
	public async updateEquipment(req: Request, res: Response): Promise<Response<[number, EquipmentInstance[]]>> {
		try {
			const equipmentAttributes = this.parseEquipmentFromBody(req, false);
			const id: number = Number.parseInt(req.params.id);
			const equipments = await this.equipmentService.updateEquipment(id, equipmentAttributes);
			if (!equipments || equipments[0] === 0) throw new Error(i18n.__(EquipmentMessages.ERROR_UPDATING_EQUIPMENT));
			return res.status(200).json({
				message: this.getEquipmentMessage(i18n.__(EquipmentMessages.EQUIPMENT_UPDATED), equipments[1][0]),
				equipment: equipments[1],
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_UPDATING_EQUIPMENT));
		}
	}

	public async addUseHours(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		throw new Error('Method not implemented.');
		// try {
		// 	const body = req.body;
		// 	let equipmentHourBody = processEquipmentHourBody(body);
		// 	const equipmentQuery = {
		// 		id: req.query.id,
		// 		code: req.query.code,
		// 	};
	
		// 	if (equipmentHourBody.hours_to_add < 0)
		// 		return catchError(res, null, 400, i18n.__("CANNOT_ADD_NEGATIVE_HOURS"));
	
		// 	const equipment = await findEquipmentByIdOrCode(equipmentQuery);
	
		// 	if (!equipment) 
		// 		return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));
	
		// 	const site = equipment.construction_site;
		// 	equipmentHourBody = appendAdditionalEquipmentData(equipmentHourBody, equipment);
	
		// 	const equipment_hour = await EquipmentHour.create(equipmentHourBody);
	
		// 	if (!equipment_hour)
		// 		return catchError(res, null, 500, i18n.__("ERROR_CREATING_EQUIPMENT_HOUR"));
	
		// 	const total = equipment.total_hours + equipment_hour.hours_to_add;
		// 	const partial = equipment.partial_hours + equipment_hour.hours_to_add;
	
		// 	const equipmentUpdated = await equipment.update({
		// 		total_hours: total,
		// 		partial_hours: partial,
		// 	});
	
		// 	if (!equipmentUpdated)
		// 		return catchError(res, null, 500, ERROR_UPDATING_EQUIPMENT);
	
		// 	if (equipmentUpdated.lubrication_sheet_id)
		// 		maintenanceController.updateNextMaintenancesForEquipment([equipmentUpdated]);
	
		// 	const message = i18n.__("EQUIPMENT_HOUR_ADDED", {
		// 		equipmentHours: `${equipment_hour.hours_to_add}`,
		// 		equipment: getEquipmentMessage(equipment)
		// 	});
		// 	return res.status(200).json({
		// 		message: message,
		// 		site: site,
		// 		equipment: equipmentUpdated,
		// 		use_hour: equipment_hour,
		// 	});
			
		// } catch (error) {
		// 	catchError(res, error, 500, i18n.__("ERROR_ADDING_HOURS"));
		// }
	}
	public async addUseHoursInBulk(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		const { hours: hoursToAdd, start_date, end_date, user_id } = req.body;
		if (!hoursToAdd || !start_date || !end_date ) throw new Error(i18n.__(EquipmentMessages.INVALID_INPUT));
		try {
			const result = await this.equipmentService.addEquipmentHoursInBulk(this.parseEquipmentHourInBulkFromBody(req));
			return res.status(result.statusCode).json({
				message: result.message,
				equipments: result.equipments,
				errors: result.errors
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_ADDING_HOURS));
		}
	}
	public async addLubricationSheetToEquipment(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			await this.equipmentService.addLubricationSheetToEquipment(equipment, req.body.lubrication_sheet_id);
			const message = this.getEquipmentMessage(i18n.__(EquipmentMessages.EQUIPMENT_ADDED_TO_LUBRICATION_SHEET), equipment);
			return res.status(200).json({
				message: message,
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_ADDING_LUBRICATION_SHEET));
		}
	}
	public async addEquipmentToSite(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			const site = await this.equipmentService.addEquipmentToSite(equipment, req.body.construction_site_id, req.body.construction_site_code);
			const equipments = await this.equipmentService.getAllEquipments();
			const message = this.getEquipmentMessage(i18n.__(EquipmentMessages.EQUIPMENT_ADDED_TO_SITE), equipment);
			return res.status(200).json({
				message: message,
				site: site,
				equipment: equipment,
				all_equipments: equipments
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_ADDING_EQUIPMENT_TO_SITE));
		}
	}
	public async removeEquipmentFromSite(req: Request, res: Response): Promise<Response<EquipmentInstance>> {
		try {
			const equipment = await this.findEquipmentByIdOrCode(req);
			if (!equipment) throw new Error(i18n.__(EquipmentMessages.EQUIPMENT_NOT_FOUND));
			const site = await this.equipmentService.removeEquipmentFromSite(equipment, req.body.construction_site_id, req.body.construction_site_code);
			const message = this.getEquipmentMessage(i18n.__(EquipmentMessages.EQUIPMENT_REMOVED_FROM_SITE), equipment);
			return res.status(200).json({
				message: message,
				site: site,
				equipment: equipment,
			});
		} catch (error) {
			return this.catchError(res, error, 500, i18n.__(EquipmentMessages.ERROR_REMOVING_EQUIPMENT_FROM_SITE));
		}
	}

	public async findEquipmentByIdOrCode(req: Request): Promise<EquipmentInstance | null> {
		let id: number | null = null;
		let code: string | null = null;

		if (typeof req.query.id === 'string') {
			id = Number.parseInt(req.query.id);
		} else if (typeof req.query.equipment_id === 'string') {
			id = Number.parseInt(req.query.equipment_id);
		}

		if (typeof req.query.code === 'string') {
			code = req.query.code;
		} else if (typeof req.query.equipment_code === 'string') {
			code = req.query.equipment_code;
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
			total_hours: total_hours || 0,
			partial_hours: partial_hours || 0,
			serial_number: serial_number || null,
			origin: origin || null,
			manuf_date: manuf_date ? new Date(manuf_date) : null,
			service_date: service_date ? new Date(service_date) : null,
			power: power || null,
			weight: weight || null,
			price: price || null,
			observations: observations || null,
			site_importance: site_importance || null,
			construction_site_id: construction_site_id || null,
			lubrication_sheet_id: lubrication_sheet_id || null,
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
			throw Error('Missing required attributes');
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