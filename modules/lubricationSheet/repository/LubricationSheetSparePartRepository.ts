import { QueryOptions } from "sequelize";
import { MaintenanceFrequencyInstance } from "../../maintenance/model/IMaintenanceFrequency";
import { LubricationSheetSparePartCreationAttributes } from "../model/ILubricationSheetSparePart";
import { LubricationSheetSparePart } from "../model/LubricationSheetSparePart";
import { ILubricationSheetSparePartRepository } from "./ILubricationSheetSparePartRepository";
import { singleton } from "tsyringe";

@singleton()
export class LubricationSheetSparePartRepository implements ILubricationSheetSparePartRepository {
	public async deleteByLubricationSheetId(lubricationSheetId: number, options?: QueryOptions): Promise<number> {
		return LubricationSheetSparePart.destroy({
			where: {
				lubrication_sheet_id: lubricationSheetId
			},
			...options
		});
	}

	public async createLubricationSheetSparePartsInBulk(lubricationSheetSpareParts: LubricationSheetSparePartCreationAttributes[], lubricationSheetId: number, options?: QueryOptions): Promise<LubricationSheetSparePart[]> {
		return LubricationSheetSparePart.bulkCreate(lubricationSheetSpareParts.map(lubricationSheetSparePart => {
			lubricationSheetSparePart.lubrication_sheet_id = lubricationSheetId;
			return lubricationSheetSparePart;
		}), options);
	}

	public async addFrequenciesToLubricationSheetSpareParts(lubricationSheetSparePart: LubricationSheetSparePart, frequencies: MaintenanceFrequencyInstance[], options?: QueryOptions): Promise<void> {
		return lubricationSheetSparePart.addFrequencies(frequencies, options);
	}

}