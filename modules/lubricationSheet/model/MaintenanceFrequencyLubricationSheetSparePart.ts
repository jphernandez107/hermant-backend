import { Model, Sequelize, DataTypes } from "sequelize";
import { MaintenanceFrequencyLubricationSheetSparePartAttributes, MaintenanceFrequencyLubricationSheetSparePartCreationAttributes, MaintenanceFrequencyLubricationSheetSparePartInstance } from "./IMaintenanceFrequencyLubricationSheetSparePart";

export class MaintenanceFrequencyLubricationSheetSparePart extends Model<MaintenanceFrequencyLubricationSheetSparePartAttributes, MaintenanceFrequencyLubricationSheetSparePartCreationAttributes> implements MaintenanceFrequencyLubricationSheetSparePartInstance {
	id: number;
	maintenance_frequency_id: number;
	lubrication_sheet_spare_part_id: number;
	replace: boolean | true;
	created_at: Date;
	updated_at: Date;

	public static associate(models: any): void {
		MaintenanceFrequencyLubricationSheetSparePart.belongsTo(models.lubrication_sheet_spare_part, {
			foreignKey: 'lubrication_sheet_spare_part_id'
		});
		MaintenanceFrequencyLubricationSheetSparePart.belongsTo(models.maintenance_frequency, {
			foreignKey: 'maintenance_frequency_id'
		});
	}

	public static initModel(sequelize: Sequelize) {
		MaintenanceFrequencyLubricationSheetSparePart.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			maintenance_frequency_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "maintenance_frequency",
					key: "id"
				}
			},
			lubrication_sheet_spare_part_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "lubrication_sheet_spare_part",
					key: "id"
				}
			},
			replace: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
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
			modelName: 'maintenance_frequency_lubrication_sheet_spare_part',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return MaintenanceFrequencyLubricationSheetSparePart;
	}
}