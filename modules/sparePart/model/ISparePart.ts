import { Model, Optional } from 'sequelize';

export interface SparePartAttributes {
	id: number;
	internal_code: string;
	external_code: string;
	type: string;
	application: string;
	brand: string;
	model: string;
	stock?: number | null;
	unit_price?: number | null;
	detail_link?: string | null;
	observations?: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface SparePartCreationAttributes extends Optional<SparePartAttributes, 'id' | 'created_at' | 'updated_at'> {}
export interface SparePartUpdateAttributes extends Optional<SparePartCreationAttributes, 'internal_code' | 'external_code' | 'type' | 'application' | 'brand' | 'model'> {}
export type SparePartInstance = SparePartAttributes & Model<SparePartAttributes, SparePartCreationAttributes>;