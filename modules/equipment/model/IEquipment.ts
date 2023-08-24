import { NextMaintenanceInstance } from '../../maintenance/model/INextMaintenance';
import { Model, Optional } from 'sequelize';

export interface EquipmentAttributes {
	id: number;
	code: string;
	brand: string;
	model: string;
	designation: string;
	total_hours: number;
	partial_hours: number;
	serial_number?: string | null;
	origin?: string | null;
	manuf_date?: Date | null;
	service_date?: Date | null;
	power?: number | null;
	weight?: number | null;
	price?: number | null;
	observations?: string | null;
	site_importance?: number | null;
	construction_site_id?: number | null;
	lubrication_sheet_id?: number | null;
	next_maintenance?: Date | null;
	created_at: Date;
	updated_at: Date;

	next_maintenances?: NextMaintenanceInstance[];
}

export interface EquipmentCreationAttributes extends Optional<EquipmentAttributes, 'id' | 'created_at' | 'updated_at'> {}
export type EquipmentInstance = EquipmentAttributes & Model<EquipmentAttributes, EquipmentCreationAttributes>;