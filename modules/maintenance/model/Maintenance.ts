import { Model, DataTypes } from "sequelize";
import { MaintenanceAttributes, MaintenanceCreationAttributes, MaintenanceInstance } from "./IMaintenance";

export class Maintenance extends Model<MaintenanceAttributes, MaintenanceCreationAttributes> implements MaintenanceInstance {
	public id!: number;
	public equipment_id!: number;
	public maintenance_frequency_id!: number;
	public equipment_partial_hours!: number;
	public equipment_total_hours!: number;
	public maintenance_date!: Date;
	public maintenance_cost?: number | 0;
	public maintenance_duration?: number | 0;
	public observations?: string | "";
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any): void {
		Maintenance.hasMany(models.maintenance_spare_part, {
			as: 'maintenance_spare_parts',
			foreignKey: "maintenance_id"
		})
		Maintenance.belongsTo(models.equipment, {
			foreignKey: 'equipment_id'
		});
		Maintenance.belongsTo(models.maintenance_frequency, {
			as: "maintenance_frequency",
			foreignKey: 'maintenance_frequency_id'
		});
	}

	public static initModel(sequelize: any) {
		Maintenance.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			equipment_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "equipment",
					key: "id"
				},
				onDelete: "cascade",
				onUpdate: "cascade"
			},
			maintenance_frequency_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "maintenance_frequency",
					key: "id"
				},
				onUpdate: "cascade"
			},
			equipment_partial_hours:{
				type: DataTypes.INTEGER
			},
			equipment_total_hours:{
				type: DataTypes.INTEGER
			},
			maintenance_cost: {
				type: DataTypes.FLOAT
			},
			maintenance_duration: {
				type: DataTypes.INTEGER
			},
			maintenance_date: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW
			},
			observations:{
				type: DataTypes.STRING
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			}
		}, {
			sequelize,
			modelName: 'maintenance',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return Maintenance;
	}
}