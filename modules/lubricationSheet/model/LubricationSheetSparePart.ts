import { Model, Sequelize, DataTypes, NOW } from "sequelize";
import { LubricationSheetSparePartAttributes, LubricationSheetSparePartCreationAttributes, LubricationSheetSparePartInstance } from "./ILubricationSheetSparePart";

export class LubricationSheetSparePart extends Model<LubricationSheetSparePartAttributes, LubricationSheetSparePartCreationAttributes> implements LubricationSheetSparePartInstance {
	public id!: number;
	public lubrication_sheet_id!: number;
	public spare_part_id!: number;
	public quantity!: number;
	public application!: string;
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any): void {
		LubricationSheetSparePart.belongsTo(models.spare_part, {
			foreignKey: 'spare_part_id'
		});
		LubricationSheetSparePart.belongsTo(models.lubrication_sheet, {
			foreignKey: 'lubrication_sheet_id'
		});
		LubricationSheetSparePart.belongsToMany(models.maintenance_frequency, {
			through: models.maintenance_frequency_lubrication_sheet_spare_part,
			as: 'frequencies',
			foreignKey: 'lubrication_sheet_spare_part_id'
		});
	}

	public static initModel(sequelize: Sequelize) {
		LubricationSheetSparePart.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			lubrication_sheet_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "lubrication_sheet",
					key: "id"
				}
			},
			spare_part_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "spare_part",
					key: "id"
				},
				onDelete: "cascade",
				onUpdate: "cascade"
			},
			quantity: {
				type: DataTypes.INTEGER
			},
			application: {
				type: DataTypes.STRING
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
			modelName: 'lubrication_sheet_spare_part',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return LubricationSheetSparePart;
	}
}