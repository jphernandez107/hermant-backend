import { Model, Optional } from "sequelize";
import { LubricationSheetSparePartCreationAttributes } from "./ILubricationSheetSparePart";
import { EquipmentInstance } from "../../equipment/model/IEquipment";
import { LubricationSheetSparePart } from "./LubricationSheetSparePart";

export interface LubricationSheetAttributes {
	id: number;
	created_at: Date;
	updated_at: Date;

	equipments?: EquipmentInstance[];
	addEquipment?: (equipment: EquipmentInstance, options?: any) => Promise<void>;
	lubrication_sheet_spare_parts?: LubricationSheetSparePart[];
}

export interface LubricationSheetCreationAttributes extends Optional<LubricationSheetAttributes, 'id' | 'created_at' | 'updated_at'> {
	frequencies: number[];
	equipment_code: string;
	spare_parts: LubricationSheetSparePartCreationAttributes[];
}
export type LubricationSheetInstance = LubricationSheetAttributes & Model<LubricationSheetAttributes, LubricationSheetCreationAttributes>;