import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";

export interface ILubricationSheetRepository {
	getAllLubricationSheets(): Promise<LubricationSheetInstance[]>
	getLubricationSheetById(id: number): Promise<LubricationSheetInstance | null>
	getLubricationSheetByEquipmentCode(equipmentCode: string): Promise<LubricationSheetInstance | null>
	createLubricationSheet(): Promise<LubricationSheetInstance>
	updateLubricationSheet(id: number, lubricationSheet: LubricationSheetCreationAttributes): Promise<[number, LubricationSheetInstance[]]>
	saveLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<LubricationSheetInstance>
	deleteLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<void>
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
