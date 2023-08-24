import { Model, DataTypes, NOW } from "sequelize";
import { MaintenanceFrequencyAttributes, MaintenanceFrequencyCreationAttributes, MaintenanceFrequencyInstance } from "./IMaintenanceFrequency";

export class MaintenanceFrequency extends Model<MaintenanceFrequencyAttributes, MaintenanceFrequencyCreationAttributes> implements MaintenanceFrequencyInstance {
	id!: number;
	frequency!: number;
	lubrication_sheet_id!: number;
	created_at!: Date;
	updated_at!: Date;

	public static associate(models: any): void {
		MaintenanceFrequency.belongsTo(models.lubrication_sheet, {
			foreignKey: 'lubrication_sheet_id',
			onDelete: 'CASCADE'
		});
		MaintenanceFrequency.hasMany(models.maintenance, {
			as: 'maintenances',
			foreignKey: "maintenance_frequency_id"
		});
		MaintenanceFrequency.belongsToMany(models.lubrication_sheet_spare_part, {
			through: models.maintenance_frequency_lubrication_sheet_spare_part,
			as: 'lubrication_sheet_spare_parts',
			foreignKey: 'maintenance_frequency_id'
		});
	}

	public static initModel(sequelize: any) {
		MaintenanceFrequency.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			frequency: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			lubrication_sheet_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "lubrication_sheet",
					key: "id"
				},
				onDelete: "cascade",
				onUpdate: "cascade"
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
			modelName: 'maintenance_frequency',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return MaintenanceFrequency;
	}

}