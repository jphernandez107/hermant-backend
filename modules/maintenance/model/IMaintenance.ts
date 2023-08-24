import { Model, Optional } from "sequelize";
import { MaintenanceSparePartCreationAttributes } from "./IMaintenanceSparePart";

export interface MaintenanceAttributes {
	id: number;
	equipment_id: number;
	maintenance_frequency_id: number;
	equipment_partial_hours: number;
	equipment_total_hours: number;
	maintenance_date: Date;
	maintenance_cost?: number | 0;
	maintenance_duration?: number | 0;
	observations?: string | "";
	created_at: Date;
	updated_at: Date;
}

export interface MaintenanceCreationAttributes extends Optional<MaintenanceAttributes, 'id' | 'created_at' | 'updated_at' | 'maintenance_cost' | 'maintenance_duration' | 'observations' | 'equipment_id' | 'equipment_partial_hours' | 'equipment_total_hours' | 'maintenance_frequency_id'> {
	reset_equipment_partial_hours?: boolean | false;
	spare_parts: MaintenanceSparePartCreationAttributes[];
	equipment_code: string;
	maintenance_frequency: number;
}
export type MaintenanceInstance = MaintenanceAttributes & Model<MaintenanceAttributes, MaintenanceCreationAttributes>;