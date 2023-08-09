import { Model, Sequelize, DataTypes, NOW } from "sequelize";
import { SparePartAttributes, SparePartCreationAttributes, SparePartInstance } from "./ISparePart";
import { IModel } from "modules/interfaces/IModel";


export class SparePart extends Model<SparePartAttributes, SparePartCreationAttributes> implements SparePartInstance, IModel {
	public id: number;
	public internal_code: string;
	public external_code: string;
	public type: string;
	public application: string;
	public brand: string;
	public model: string;
	public stock?: number | null;
	public unit_price?: number | null;
	public detail_link?: string | null;
	public observations?: string | null;
	public created_at: Date;
	public updated_at: Date;

	public associate(models: any): void {
		SparePart.hasMany(models.lubrication_sheet_spare_part, {
			as: 'lubrication_sheet_spare_parts',
			foreignKey: "spare_part_id"
		});
		SparePart.hasMany(models.maintenance_spare_part, {
			as: 'maintenance_spare_parts',
			foreignKey: "spare_part_id"
		});
	}

	public initModel(sequelize: Sequelize): void {
		SparePart.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			internal_code: {
				type: DataTypes.STRING,
				allowNull: false
			},
			external_code: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			type: {
				type: DataTypes.STRING,
			},
			application: {
				type: DataTypes.STRING,
			},
			brand: {
				type: DataTypes.STRING,
			},
			model: {
				type: DataTypes.STRING,
			},
			stock: {
				type: DataTypes.INTEGER,
			},
			unit_price: {
				type: DataTypes.INTEGER,
			},
			detail_link: {
				type: DataTypes.STRING,
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
				defaultValue: NOW,
			}
		}, {
			sequelize,
			modelName: 'spare_part',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});
	}
}