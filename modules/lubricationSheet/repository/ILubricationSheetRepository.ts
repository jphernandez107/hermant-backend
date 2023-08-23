import { QueryOptions, Transaction } from "sequelize";
import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";

export interface ILubricationSheetRepository {
	getAllLubricationSheets(): Promise<LubricationSheetInstance[]>
	getLubricationSheetById(id: number, options?: QueryOptions): Promise<LubricationSheetInstance | null>
	getLubricationSheetByEquipmentCode(equipmentCode: string): Promise<LubricationSheetInstance | null>
	createLubricationSheet(options?: QueryOptions): Promise<LubricationSheetInstance>
	updateLubricationSheet(id: number, lubricationSheet: LubricationSheetCreationAttributes): Promise<[number]>
	saveLubricationSheet(lubricationSheet: LubricationSheetInstance, options?: QueryOptions): Promise<LubricationSheetInstance>
	deleteLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<void>
	startTransaction(): Promise<Transaction>
}

export const LubricationSheetIncludes = [
	{
		association: 'equipments'
	},
	{
		association: 'lubrication_sheet_spare_parts',
		include: [
			{
				association: 'spare_part'
			},
			{
				association: 'frequencies'
			}
		]
	}
];
