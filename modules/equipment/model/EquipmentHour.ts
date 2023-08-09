import { Sequelize, DataTypes, Model, NOW } from 'sequelize';
import { EquipmentHourAttributes, EquipmentHourCreationAttributes, EquipmentHourInstance } from './IEquipmentHour';
import { IModel } from 'modules/interfaces/IModel';

export class EquipmentHour extends Model<EquipmentHourAttributes, EquipmentHourCreationAttributes> implements EquipmentHourAttributes, IModel {
	public id!: number;
	public hours_to_add!: number;
	public total_hours!: number;
	public partial_hours!: number;
	public date!: Date;
	public observations?: string | null;
	public equipment_id!: number;
	public construction_site_id?: number | null;
	public user_id!: number;
	public created_at!: Date;
	public updated_at!: Date;

	public initModel(sequelize: Sequelize): void {
		EquipmentHour.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			hours_to_add: {
				type: DataTypes.INTEGER
			},
			total_hours: {
				type: DataTypes.INTEGER
			},
			partial_hours: {
				type: DataTypes.INTEGER
			},
			date: {
				type: DataTypes.DATE,
			},
			observations: {
				type: DataTypes.TEXT
			},
			equipment_id: {
				type: DataTypes.INTEGER,
				references: {
					model: 'equipment',
					key: 'id'
				}
			},
			construction_site_id: {
				type: DataTypes.INTEGER,
				references: {
					model: 'construction_site',
					key: 'id'
				}
			},
			user_id: {
				type: DataTypes.INTEGER
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
			modelName: 'equipment_hour',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});
	}

	public associate(models: any): void {
		EquipmentHour.belongsTo(models.equipment, {
			as: 'equipment',
			foreignKey: "equipment_id"
		});
		EquipmentHour.belongsTo(models.construction_site, {
			as: 'construction_site',
			foreignKey: "construction_site_id"
		});
	}
}
