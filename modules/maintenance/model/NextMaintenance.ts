import { Model, DataTypes, NOW } from "sequelize";
import { NextMaintenanceAttributes, NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "./INextMaintenance";

export class NextMaintenance extends Model<NextMaintenanceAttributes, NextMaintenanceCreationAttributes> implements NextMaintenanceInstance {
	public id!: number;
	public equipment_id!: number;
	public maintenance_frequency_id!: number;
	public maintenance_date!: Date;
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any): void {
		NextMaintenance.belongsTo(models.equipment, {
			as: 'equipment',
			foreignKey: 'equipment_id'
		});
		NextMaintenance.belongsTo(models.maintenance_frequency, {
			as: "maintenance_frequency",
			foreignKey: 'maintenance_frequency_id'
		});
	}
	
	public static initModel(sequelize: any) {
		NextMaintenance.init({
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
				}
			},
			maintenance_frequency_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "maintenance_frequency",
					key: "id"
				}
			},
			maintenance_date: {
				type: DataTypes.DATE,
				defaultValue: NOW
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: NOW
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: NOW,
			}
		}, {
			sequelize,
			modelName: 'next_maintenance',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return NextMaintenance;
	}

	
}