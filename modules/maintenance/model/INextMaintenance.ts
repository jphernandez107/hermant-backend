import { Model, Optional } from "sequelize";

export interface NextMaintenanceAttributes {
	id: number;
	equipment_id: number;
	maintenance_frequency_id: number;
	maintenance_date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface NextMaintenanceCreationAttributes extends Optional<NextMaintenanceAttributes, 'id' | 'created_at' | 'updated_at'> {}
export type NextMaintenanceInstance = NextMaintenanceAttributes & Model<NextMaintenanceAttributes, NextMaintenanceCreationAttributes>;