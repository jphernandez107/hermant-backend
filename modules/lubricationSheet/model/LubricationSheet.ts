import { Model, Sequelize, DataTypes, NOW } from "sequelize";
import { LubricationSheetAttributes, LubricationSheetCreationAttributes, LubricationSheetInstance } from "./ILubricationSheet";

export class LubricationSheet extends Model<LubricationSheetAttributes, LubricationSheetCreationAttributes> implements LubricationSheetInstance {
	public id!: number;
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any): void {
		LubricationSheet.hasMany(models.equipment, {
			as: 'equipments',
			foreignKey: "lubrication_sheet_id"
		});
		LubricationSheet.hasMany(models.lubrication_sheet_spare_part, {
			as: 'lubrication_sheet_spare_parts',
			foreignKey: "lubrication_sheet_id"
		});
	}

	public static initModel(sequelize: Sequelize) {
		LubricationSheet.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
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
			modelName: 'lubrication_sheet',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return LubricationSheet;
	}
}