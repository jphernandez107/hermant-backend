import { LubricationSheetSparePartCreationAttributes, LubricationSheetSparePartInstance } from "../model/ILubricationSheetSparePart"
import { MaintenanceFrequencyInstance } from "../../maintenance/model/IMaintenanceFrequency"
import { QueryOptions } from "sequelize"

export interface ILubricationSheetSparePartRepository {
	deleteByLubricationSheetId(lubricationSheetId: number, options?: QueryOptions): Promise<number>
	createLubricationSheetSparePartsInBulk(lubricationSheetSpareParts: LubricationSheetSparePartCreationAttributes[], lubricationSheetId: number, options?: QueryOptions): Promise<LubricationSheetSparePartInstance[]>
	addFrequenciesToLubricationSheetSpareParts(lubricationSheetSparePart: LubricationSheetSparePartInstance, frequencies: MaintenanceFrequencyInstance[], options?: QueryOptions): Promise<void>
}