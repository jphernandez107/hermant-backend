import { Model, Optional } from "sequelize";

export interface MaintenanceFrequencyLubricationSheetSparePartAttributes {
	id: number;
	maintenance_frequency_id: number;
	lubrication_sheet_spare_part_id: number;
	replace: boolean | false;
	created_at: Date;
	updated_at: Date;
}

export interface MaintenanceFrequencyLubricationSheetSparePartCreationAttributes extends Optional<MaintenanceFrequencyLubricationSheetSparePartAttributes, 'id' | 'created_at' | 'updated_at'> {}
export type MaintenanceFrequencyLubricationSheetSparePartInstance = MaintenanceFrequencyLubricationSheetSparePartAttributes & Model<MaintenanceFrequencyLubricationSheetSparePartAttributes, MaintenanceFrequencyLubricationSheetSparePartCreationAttributes>;