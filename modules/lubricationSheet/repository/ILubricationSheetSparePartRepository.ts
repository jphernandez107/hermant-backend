import { LubricationSheetSparePartCreationAttributes, LubricationSheetSparePartInstance } from "../model/ILubricationSheetSparePart"
import { MaintenanceFrequencyInstance } from "../../maintenance/model/IMaintenanceFrequency"

export interface ILubricationSheetSparePartRepository {
	deleteByLubricationSheetId(lubricationSheetId: number): Promise<number>
	createLubricationSheetSparePartsInBulk(lubricationSheetSpareParts: LubricationSheetSparePartCreationAttributes[], lubricationSheetId: number): Promise<LubricationSheetSparePartInstance[]>
	addFrequenciesToLubricationSheetSpareParts(lubricationSheetSparePart: LubricationSheetSparePartInstance, frequencies: MaintenanceFrequencyInstance[]): Promise<void>
}