import { EquipmentInstance } from 'modules/equipment/model/IEquipment';
import { Model, Optional } from 'sequelize';

export interface ConstructionSiteAttributes {
	id: number;
	code: string;
	name: string;
	district?: string | null;
	province?: string | null;
	init_date?: Date | null;
	finish_date?: Date | null;
	max_temp?: number | null;
	min_temp?: number | null;
	altitude?: number | null;
	dust?: number | null;
	distance?: number | null;
	observations?: string | null;
	created_at: Date;
	updated_at: Date;

	addEquipment?: (equipment: EquipmentInstance, options?: any) => Promise<void>;
}

export interface ConstructionSiteCreationAttributes extends Optional<ConstructionSiteAttributes, 'id' | 'created_at' | 'updated_at'> {}
export interface ConstructionSiteUpdateAttributes extends Optional<ConstructionSiteCreationAttributes, 'name' | 'code'> {}
export type ConstructionSiteInstance = ConstructionSiteAttributes & Model<ConstructionSiteAttributes, ConstructionSiteCreationAttributes>;