import { SparePartInstance } from "../model/ISparePart";
import { ISparePartRepository } from "../repository/ISparePartRepository";
import { ISparePartService, SparePartMessages } from "./ISparePartService";

export class SparePartService implements ISparePartService {
	private sparePartRepository: ISparePartRepository;

	constructor(sparePartRepository: ISparePartRepository) {
		this.sparePartRepository = sparePartRepository;
	}

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

	public async updateSparePart(id: number, sparePartAttributes: SparePartInstance): Promise<[number, SparePartInstance[]]> {
		return this.sparePartRepository.updateSparePart(id, sparePartAttributes);
	}

	public async deleteSparePart(id: number | null, externalCode: string | null): Promise<void> {
		const sparePart = await this.getSparePartByIdOrExternalCode(id, externalCode);
		if (!sparePart) throw new Error(i18n.__(SparePartMessages.SPARE_PART_NOT_FOUND));
		return this.sparePartRepository.deleteSparePart(sparePart);
	}

}