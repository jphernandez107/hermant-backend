import { SparePartCreationAttributes, SparePartInstance, SparePartUpdateAttributes } from "../model/ISparePart";


export interface ISparePartRepository {
	getAllSpareParts(): Promise<SparePartInstance[]>;
	getSparePartById(id: number): Promise<SparePartInstance | null>;
	getSparePartByExternalCode(externalCode: string): Promise<SparePartInstance | null>;
	createSparePart(sparePart: SparePartCreationAttributes): Promise<SparePartInstance>;
	updateSparePart(id: number, sparePart: SparePartUpdateAttributes): Promise<[number, SparePartInstance[]]>;
	saveSparePart(sparePart: SparePartInstance): Promise<SparePartInstance>;
	deleteSparePart(sparePart: SparePartInstance): Promise<void>;
}

export const SparePartIncludes = [
	{
		association: 'lubrication_sheet_spare_parts',
		include: [
			{
				association: 'lubrication_sheet',
				include: [
					{
						association: 'equipments'
					}
				]
			}
		]
	}
];
