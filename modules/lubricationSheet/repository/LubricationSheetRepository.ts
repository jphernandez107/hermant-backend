import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { LubricationSheet } from "../model/LubricationSheet";
import { ILubricationSheetRepository, LubricationSheetIncludes } from "./ILubricationSheetRepository";

export class LubricationSheetRepository implements ILubricationSheetRepository {
	public async getAllLubricationSheets(): Promise<LubricationSheetInstance[]> {
		return LubricationSheet.findAll({
				include: LubricationSheetIncludes,
				order: [
					['id', 'DESC']
				]
			});
	}
	public async getLubricationSheetById(id: number): Promise<LubricationSheetInstance | null> {
		return LubricationSheet.findByPk(id, {
			include: LubricationSheetIncludes
		});
	}
	public async getLubricationSheetByEquipmentCode(equipmentCode: string): Promise<LubricationSheetInstance | null> {
		const include = JSON.parse(JSON.stringify(LubricationSheetIncludes));
		include[0].where = {
			code: equipmentCode
		}
		return LubricationSheet.findOne({
			include: include
		});
	}
	public async createLubricationSheet(): Promise<LubricationSheetInstance> {
		return LubricationSheet.create();
	}
	public async updateLubricationSheet(id: number, lubricationSheetAttributes: LubricationSheetCreationAttributes): Promise<[number, LubricationSheetInstance[]]> {
		return LubricationSheet.update(lubricationSheetAttributes, {
			where: { id: id },
			returning: true
		});
	}
	public async saveLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<LubricationSheetInstance> {
		return lubricationSheet.save();
	}
	public async deleteLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<void> {
		return lubricationSheet.destroy()
	}
}