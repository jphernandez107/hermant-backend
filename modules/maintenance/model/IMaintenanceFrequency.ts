import { Model, Optional } from "sequelize";

export interface MaintenanceFrequencyAttributes {
	id: number;
	frequency: number;
	lubrication_sheet_id: number;
	created_at: Date;
	updated_at: Date;
}

export interface MaintenanceFrequencyCreationAttributes extends Optional<MaintenanceFrequencyAttributes, 'id' | 'created_at' | 'updated_at' | 'lubrication_sheet_id'> {}
export type MaintenanceFrequencyInstance = MaintenanceFrequencyAttributes & Model<MaintenanceFrequencyAttributes, MaintenanceFrequencyCreationAttributes>;