import { Model, Optional } from 'sequelize';

export interface EquipmentHourAttributes {
	id: number;
	hours_to_add: number;
	total_hours: number;
	partial_hours: number;
	date: Date;
	observations?: string | null;
	equipment_id: number;
	construction_site_id?: number | null;
	user_id: number;
	created_at: Date;
	updated_at: Date;
}

export interface EquipmentHourCreationAttributes extends Optional<EquipmentHourAttributes, 'id' | 'created_at' | 'updated_at' > {}

export interface EquipmentHourCreationInBulkItemAttributes {
	hours: number;
	code: string;
}
export interface EquipmentHourCreationInBulkAttributes {
	hours: EquipmentHourCreationInBulkItemAttributes[];
	start_date: Date;
	end_date: Date;
	user_id: number;
}
export type EquipmentHourInstance = EquipmentHourAttributes & Model<EquipmentHourAttributes, EquipmentHourCreationAttributes>;