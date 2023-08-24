import { inject, singleton, injectable } from "tsyringe";
import { SparePartInstance } from "../model/ISparePart";
import { ISparePartRepository } from "../repository/ISparePartRepository";
import { SparePartRepository } from "../repository/SparePartRepository";
import { ISparePartService, SparePartMessages } from "./ISparePartService";
import i18n from 'i18n';

@singleton()
@injectable()
export class SparePartService implements ISparePartService {
	
	constructor(
		@inject(SparePartRepository) private sparePartRepository: ISparePartRepository
	){}

	public async getAllSpareParts(): Promise<SparePartInstance[]> {
		return this.sparePartRepository.getAllSpareParts();
	}

	public async getSparePartByIdOrExternalCode(id: number | null, externalCode: string | null): Promise<SparePartInstance | null> {
		if (id) {
			return this.sparePartRepository.getSparePartById(id);
		}
		if (externalCode) {
			return this.sparePartRepository.getSparePartByExternalCode(externalCode);
		}
		return null;
	}

	public async createSparePart(sparePartAttributes: SparePartInstance): Promise<SparePartInstance> {
		return this.sparePartRepository.createSparePart(sparePartAttributes);
	}

	public async updateSparePart(id: number, sparePartAttributes: SparePartInstance): Promise<[number, SparePartInstance]> {
		const sparePart = await this.sparePartRepository.getSparePartById(id);
		if (!sparePart) throw new Error(i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
		const count = await this.sparePartRepository.updateSparePart(id, sparePartAttributes);
		return [count[0], sparePart];
	}

	public async deleteSparePart(id: number | null, externalCode: string | null): Promise<void> {
		const sparePart = await this.getSparePartByIdOrExternalCode(id, externalCode);
		if (!sparePart) throw new Error(i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
		return this.sparePartRepository.deleteSparePart(sparePart);
	}

}