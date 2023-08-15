import { Model, Sequelize, DataTypes, NOW } from "sequelize";
import { LubricationSheetAttributes, LubricationSheetCreationAttributes, LubricationSheetInstance } from "./ILubricationSheet";
import { IModel } from "modules/interfaces/IModel";

export class LubricationSheet extends Model<LubricationSheetAttributes, LubricationSheetCreationAttributes> implements LubricationSheetInstance, IModel {
	public id!: number;
	public created_at!: Date;
	public updated_at!: Date;

	public associate(models: any): void {
		LubricationSheet.hasMany(models.equipment, {
			as: 'equipments',
			foreignKey: "lubrication_sheet_id"
		});
		LubricationSheet.hasMany(models.lubrication_sheet_spare_part, {
			as: 'lubrication_sheet_spare_parts',
			foreignKey: "lubrication_sheet_id"
		});
	}

	public initModel(sequelize: Sequelize): void {
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
	}
}