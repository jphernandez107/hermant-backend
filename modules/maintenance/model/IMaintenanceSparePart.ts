import { Model, Optional } from "sequelize";

export interface MaintenanceSparePartAttributes {
	id: number;
	maintenance_id: number;
	spare_part_id: number;
	quantity: number;
	application: string;
	partial_cost: number;
	created_at: Date;
	updated_at: Date;
}

export interface MaintenanceSparePartCreationAttributes extends Optional<MaintenanceSparePartAttributes, 'id' | 'created_at' | 'updated_at' | 'maintenance_id' | 'partial_cost'> {
	frequencies: number[];
}
export type MaintenanceSparePartInstance = MaintenanceSparePartAttributes & Model<MaintenanceSparePartAttributes, MaintenanceSparePartCreationAttributes>;