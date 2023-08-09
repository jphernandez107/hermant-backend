import { SparePartCreationAttributes, SparePartInstance, SparePartUpdateAttributes } from "../model/ISparePart";

export interface ISparePartService {
	getAllSpareParts(): Promise<SparePartInstance[]>;
	getSparePartByIdOrExternalCode(id: number | null, externalCode: string | null): Promise<SparePartInstance | null>;
	createSparePart(sparePart: SparePartCreationAttributes): Promise<SparePartInstance>;
	updateSparePart(id: number, sparePart: SparePartUpdateAttributes): Promise<[number, SparePartInstance[]]>;
	deleteSparePart(id: number | null, externalCode: string | null): Promise<void>;
}

export const SparePartMessages = {
	SPARE_PART_NOT_FOUND: "SPARE_PART_NOT_FOUND",
	ERROR_CREATING_SPARE_PART: "ERROR_CREATING_SPARE_PART",
	SPARE_PART_CREATED: "SPARE_PART_CREATED",
	ERROR_DELETING_SPARE_PART: "ERROR_DELETING_SPARE_PART",
	SPARE_PART_DELETED: "SPARE_PART_DELETED",
	ERROR_UPDATING_SPARE_PART: "ERROR_UPDATING_SPARE_PART",
	SPARE_PART_UPDATED: "SPARE_PART_UPDATED",
}