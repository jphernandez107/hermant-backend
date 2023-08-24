import { SparePart } from "modules/sparePart/model/SparePart";
import { MaintenanceFrequencyInstance } from "../../maintenance/model/IMaintenanceFrequency";
import { Model, Optional } from "sequelize";

export interface LubricationSheetSparePartAttributes {
	id: number;
	lubrication_sheet_id: number;
	spare_part_id: number;
	quantity: number;
	application: string;
	created_at: Date;
	updated_at: Date;

	spare_part?: SparePart;
	frequencies?: MaintenanceFrequencyInstance[];
}

export interface LubricationSheetSparePartCreationAttributes extends Optional<LubricationSheetSparePartAttributes, 'id' | 'lubrication_sheet_id' | 'created_at' | 'updated_at'> {
	raw_frequencies: number[];
}
export type LubricationSheetSparePartInstance = LubricationSheetSparePartAttributes & Model<LubricationSheetSparePartAttributes, LubricationSheetSparePartCreationAttributes>;

declare module 'sequelize' {
	interface Model {
		addFrequencies?: (frequencies: MaintenanceFrequencyInstance[], options?: any) => Promise<void>;
	}
}