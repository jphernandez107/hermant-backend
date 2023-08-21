import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentHourCreationInBulkAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';
import { ConstructionSiteInstance } from '../../constructionSite/model/IConstructionSite';

export interface IEquipmentService {
	getAllEquipments(): Promise<EquipmentInstance[]>;
	getEquipmentByIdOrCode(id: number | null, code: string | null): Promise<EquipmentInstance | null>;
	createEquipment(equipmentAttributes: EquipmentCreationAttributes): Promise<EquipmentInstance>;
	updateEquipment(id: number | null, code: string | null, equipmentAttributes: EquipmentCreationAttributes): Promise<[number, EquipmentInstance]>;
	deleteEquipment(id: number | null, code: string | null): Promise<EquipmentInstance>;
	getAllEquipmentHours(): Promise<EquipmentHourInstance[]>;
	addEquipmentHoursInBulk(equipmentHours: EquipmentHourCreationInBulkAttributes): Promise<EquipmentHourAddedInBulk>;
	addLubricationSheetToEquipment(equipment: EquipmentInstance, lubricationSheetId: number): Promise<EquipmentInstance>;
	addEquipmentToSite(equipment: EquipmentInstance, siteId: number | null, siteCode: string | null): Promise<ConstructionSiteInstance>;
	removeEquipmentFromSite(equipment: EquipmentInstance, siteId: number | null, siteCode: string | null): Promise<ConstructionSiteInstance>;
	getEquipmentHoursByEquipmentId(equipmentId: number): Promise<EquipmentHourInstance[]>;
}

export interface EquipmentHourAddedInBulk {
	statusCode: number,
	message: string,
	equipments: EquipmentInstance[],
	errors: string[]
}

export const EquipmentMessages = {
	EQUIPMENT_NOT_FOUND: "EQUIPMENT_NOT_FOUND",
	ERROR_CREATING_EQUIPMENT: "ERROR_CREATING_EQUIPMENT",
	EQUIPMENT_CREATED: "EQUIPMENT_CREATED",
	EQUIPMENT_DELETED: "EQUIPMENT_DELETED",
	ERROR_DELETING_EQUIPMENT: "ERROR_DELETING_EQUIPMENT",
	ERROR_UPDATING_EQUIPMENT: "ERROR_UPDATING_EQUIPMENT",
	EQUIPMENT_UPDATED: "EQUIPMENT_UPDATED",
	INVALID_INPUT: "INVALID_INPUT",
	ERROR_ADDING_HOURS: "ERROR_ADDING_HOURS",
	EQUIPMENT_ADDED_TO_LUBRICATION_SHEET: "EQUIPMENT_ADDED_TO_LUBRICATION_SHEET",
	ERROR_ADDING_LUBRICATION_SHEET: "ERROR_ADDING_LUBRICATION_SHEET",
	EQUIPMENT_ADDED_TO_SITE: "EQUIPMENT_ADDED_TO_SITE",
	ERROR_ADDING_EQUIPMENT_TO_SITE: "ERROR_ADDING_EQUIPMENT_TO_SITE",
	EQUIPMENT_REMOVED_FROM_SITE: "EQUIPMENT_REMOVED_FROM_SITE",
	ERROR_REMOVING_EQUIPMENT_FROM_SITE: "ERROR_REMOVING_EQUIPMENT_FROM_SITE",
	EQUIPMENT_HOUR_BULK_ADDED: "EQUIPMENT_HOUR_BULK_ADDED",
	ERROR_ADDING_HOURS_TO_EQUIPMENTS: "ERROR_ADDING_HOURS_TO_EQUIPMENTS",
}