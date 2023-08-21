import { Model, DataTypes, NOW } from "sequelize";
import { MaintenanceSparePartAttributes, MaintenanceSparePartCreationAttributes, MaintenanceSparePartInstance } from "./IMaintenanceSparePart";

export class MaintenanceSparePart extends Model<MaintenanceSparePartAttributes, MaintenanceSparePartCreationAttributes> implements MaintenanceSparePartInstance {
	public id!: number;
	public maintenance_id!: number;
	public spare_part_id!: number;
	public quantity!: number;
	public application!: string;
	public partial_cost!: number;
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any): void {
		MaintenanceSparePart.belongsTo(models.maintenance, {
			foreignKey: 'maintenance_id'
		});
		MaintenanceSparePart.belongsTo(models.spare_part, {
			foreignKey: 'spare_part_id'
		});
	}

	public static initModel(sequelize: any) {
		MaintenanceSparePart.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			maintenance_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "maintenance",
					key: "id"
				}
			},
			spare_part_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "spare_part",
					key: "id"
				}
			},
			quantity: {
				type: DataTypes.INTEGER
			},
			application: {
				type: DataTypes.STRING
			},
			partial_cost: {
				type: DataTypes.FLOAT
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
			modelName: 'maintenance_spare_part',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return MaintenanceSparePart;
	}

}