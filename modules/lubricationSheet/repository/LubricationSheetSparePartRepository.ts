import { MaintenanceFrequencyInstance } from "modules/maintenance/model/IMaintenanceFrequency";
import { LubricationSheetSparePartCreationAttributes } from "../model/ILubricationSheetSparePart";
import { LubricationSheetSparePart } from "../model/LubricationSheetSparePart";
import { ILubricationSheetSparePartRepository } from "./ILubricationSheetSparePartRepository";

export class LubricationSheetSparePartRepository implements ILubricationSheetSparePartRepository {
	public async deleteByLubricationSheetId(lubricationSheetId: number): Promise<number> {
		return LubricationSheetSparePart.destroy({
			where: {
				lubrication_sheet_id: lubricationSheetId
			}
		});
	}

	public async createLubricationSheetSparePartsInBulk(lubricationSheetSpareParts: LubricationSheetSparePartCreationAttributes[], lubricationSheetId: number): Promise<LubricationSheetSparePart[]> {
		return LubricationSheetSparePart.bulkCreate(lubricationSheetSpareParts.map(lubricationSheetSparePart => {
			lubricationSheetSparePart.lubrication_sheet_id = lubricationSheetId;
			return lubricationSheetSparePart;
		}));
	}

	public async addFrequenciesToLubricationSheetSpareParts(lubricationSheetSparePart: LubricationSheetSparePart, frequencies: MaintenanceFrequencyInstance[]): Promise<void> {
		return lubricationSheetSparePart.addFrequencies(frequencies);
	}

}