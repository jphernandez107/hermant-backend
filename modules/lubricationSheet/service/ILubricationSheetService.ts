import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { LubricationSheetSparePartCreationAttributes } from "../model/ILubricationSheetSparePart";

export interface ILubricationSheetService {
	getAllLubricationSheets(): Promise<LubricationSheetInstance[]>
	getLubricationSheetById(id: number): Promise<LubricationSheetInstance | null>
	getLubricationSheetByEquipmentCode(equipmentCode: string): Promise<LubricationSheetInstance | null>
	createLubricationSheet(): Promise<LubricationSheetInstance>
	updateLubricationSheet(id: number, lubricationSheet: LubricationSheetCreationAttributes): Promise<[number, LubricationSheetInstance[]]>
	deleteLubricationSheet(id: number): Promise<void>

	addSparePartsToLubricationSheet(lubricationSheetAttributes: LubricationSheetCreationAttributes): Promise<LubricationSheetInstance>
}

export const LubricationSheetMessages = {
	LUBRICATION_SHEET_NOT_FOUND: 'LUBRICATION_SHEET_NOT_FOUND',
	ERROR_CREATING_LUBRICATION_SHEET: 'ERROR_CREATING_LUBRICATION_SHEET',
	LUBRICATION_SHEET_CREATED: 'LUBRICATION_SHEET_CREATED',
	ERROR_DELETING_LUBRICATION_SHEET: 'ERROR_DELETING_LUBRICATION_SHEET',
	LUBRICATION_SHEET_DELETED: 'LUBRICATION_SHEET_DELETED',
	ERROR_UPDATING_LUBRICATION_SHEET: 'ERROR_UPDATING_LUBRICATION_SHEET',
	LUBRICATION_SHEET_UPDATED: 'LUBRICATION_SHEET_UPDATED',
	ERROR_CREATING_MAINTENANCE_FREQUENCIES: 'ERROR_CREATING_MAINTENANCE_FREQUENCIES',
	ERROR_CREATING_SHEET_ROWS: 'ERROR_CREATING_SHEET_ROWS',
	ERROR_ADDING_SPARE_PARTS_TO_LUBRICATION_SHEET: 'ERROR_ADDING_SPARE_PARTS_TO_LUBRICATION_SHEET',
}
