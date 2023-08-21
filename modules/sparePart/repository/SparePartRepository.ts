import { singleton } from "tsyringe";
import { SparePartInstance, SparePartCreationAttributes, SparePartUpdateAttributes } from "../model/ISparePart";
import { SparePart } from "../model/SparePart";
import { ISparePartRepository, SparePartIncludes } from "./ISparePartRepository";

@singleton()
export class SparePartRepository implements ISparePartRepository {
	public async getAllSpareParts(): Promise<SparePartInstance[]> {
		return SparePart.findAll({
			include: SparePartIncludes,
			order: [
				['external_code', 'DESC']
			]
		});
	}
	public async getSparePartById(id: number): Promise<SparePartInstance> {
		return SparePart.findByPk(id, {
			include: SparePartIncludes
		});
	}
	public async getSparePartByExternalCode(externalCode: string): Promise<SparePartInstance> {
		return SparePart.findOne({
			where: {
				external_code: externalCode
			},
			include: SparePartIncludes
		});
	}
	public async createSparePart(sparePartAttributes: SparePartCreationAttributes): Promise<SparePartInstance> {
		return SparePart.create(sparePartAttributes);
	}
	public async updateSparePart(id: number, sparePartAttributes: SparePartUpdateAttributes): Promise<[number, SparePartInstance[]]> {
		return SparePart.update(sparePartAttributes, {
			where: { id: id },
			returning: true
		});
	}
	public async saveSparePart(sparePart: SparePartInstance): Promise<SparePartInstance> {
		return sparePart.save();
	}
	public async deleteSparePart(sparePart: SparePartInstance): Promise<void> {
		return sparePart.destroy()
	}
	
}