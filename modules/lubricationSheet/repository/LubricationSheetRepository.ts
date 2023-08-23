import { singleton } from "tsyringe";
import { LubricationSheetCreationAttributes, LubricationSheetInstance } from "../model/ILubricationSheet";
import { LubricationSheet } from "../model/LubricationSheet";
import { ILubricationSheetRepository, LubricationSheetIncludes } from "./ILubricationSheetRepository";
import { QueryOptions, Sequelize, Transaction } from "sequelize";
import { sequelize } from "../../../ORM";

@singleton()
export class LubricationSheetRepository implements ILubricationSheetRepository {
	private sequelize: Sequelize = sequelize;

	public async getAllLubricationSheets(): Promise<LubricationSheetInstance[]> {
		return LubricationSheet.findAll({
				include: LubricationSheetIncludes,
				order: [
					['id', 'DESC']
				]
			});
	}
	public async getLubricationSheetById(id: number, options?: QueryOptions): Promise<LubricationSheetInstance | null> {
		return LubricationSheet.findByPk(id, {
			include: LubricationSheetIncludes,
			...options
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
	public async createLubricationSheet(options?: QueryOptions): Promise<LubricationSheetInstance> {
		return LubricationSheet.create({}, options);
	}
	public async updateLubricationSheet(id: number, lubricationSheetAttributes: LubricationSheetCreationAttributes): Promise<[number]> {
		return LubricationSheet.update(lubricationSheetAttributes, {
			where: { id: id }
		});
	}
	public async saveLubricationSheet(lubricationSheet: LubricationSheetInstance, options?: QueryOptions): Promise<LubricationSheetInstance> {
		return lubricationSheet.save(options);
	}
	public async reloadLubricationSheet(lubricationSheet: LubricationSheetInstance, options?: QueryOptions): Promise<LubricationSheetInstance> {
		return lubricationSheet.reload({
			include: LubricationSheetIncludes,
			...options
		});
	}
	public async deleteLubricationSheet(lubricationSheet: LubricationSheetInstance): Promise<void> {
		return lubricationSheet.destroy()
	}

	public async startTransaction(): Promise<Transaction> {
		return this.sequelize.transaction();
	}
}