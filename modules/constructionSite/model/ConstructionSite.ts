import { Model, DataTypes, Sequelize, NOW } from 'sequelize';
import { ConstructionSiteAttributes, ConstructionSiteCreationAttributes, ConstructionSiteInstance } from './IConstructionSite';
import { IModel } from 'modules/interfaces/IModel';

export class ConstructionSite extends Model<ConstructionSiteAttributes, ConstructionSiteCreationAttributes> implements ConstructionSiteInstance, IModel {
	public id!: number;
	public code!: string;
	public name!: string;
	public district?: string;
	public province?: string;
	public init_date?: Date;
	public finish_date?: Date;
	public max_temp?: number;
	public min_temp?: number;
	public altitude?: number;
	public dust?: number;
	public distance?: number;
	public observations?: string;
	public created_at!: Date;
	public updated_at!: Date;

	public associate(models: any) {
		ConstructionSite.hasMany(models.equipment, {
			as: 'equipments',
			foreignKey: 'construction_site_id',
		});
	}

	public initModel(sequelize: Sequelize) {
		ConstructionSite.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		code: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
		},
		district: {
			type: DataTypes.STRING,
		},
		province: {
			type: DataTypes.STRING,
		},
		init_date: {
			type: DataTypes.DATE,
		},
		finish_date: {
			type: DataTypes.DATE,
		},
		max_temp: {
			type: DataTypes.FLOAT,
		},
		min_temp: {
			type: DataTypes.FLOAT,
		},
		altitude: {
			type: DataTypes.FLOAT,
		},
		dust: {
			type: DataTypes.FLOAT,
		},
		distance: {
			type: DataTypes.FLOAT,
		},
		observations: {
			type: DataTypes.STRING,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: NOW
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: NOW
		}
		}, {
		sequelize,
		modelName: 'construction_site',
		freezeTableName: true,
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
		})
	}
}
