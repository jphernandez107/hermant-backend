import { Model, DataTypes, Sequelize, NOW } from 'sequelize';
import { EquipmentAttributes, EquipmentCreationAttributes, EquipmentInstance } from './IEquipment';

export class Equipment extends Model<EquipmentAttributes, EquipmentCreationAttributes> implements EquipmentInstance {
	public id!: number;
	public code!: string;
	public brand!: string;
	public model!: string;
	public designation!: string;
	public total_hours!: number;
	public partial_hours!: number;
	public serial_number?: string;
	public origin?: string;
	public manuf_date?: Date;
	public service_date?: Date;
	public power?: number;
	public weight?: number;
	public price?: number;
	public observations?: string;
	public site_importance?: number;
	public next_maintenance?: Date;
	public construction_site_id?: number;
	public lubrication_sheet_id?: number;
	public created_at!: Date;
	public updated_at!: Date;

	public static associate(models: any) {
		Equipment.belongsTo(models.construction_site, {
			as: 'construction_site',
			foreignKey: 'construction_site_id',
		});
		Equipment.belongsTo(models.lubrication_sheet, {
			as: 'lubrication_sheet'
		});
		Equipment.hasMany(models.maintenance, {
			as: 'maintenances',
			foreignKey: "equipment_id"
		});
		Equipment.hasMany(models.equipment_hour, {
			as: 'equipment_hour',
			foreignKey: "equipment_id"
		});
		Equipment.hasMany(models.next_maintenance, {
			as: 'next_maintenances',
			foreignKey: "equipment_id"
		});
	}

	public static initModel(sequelize: Sequelize) {
		Equipment.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			code: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			brand: {
				type: DataTypes.STRING,
				allowNull: false
			},
			model: {
				type: DataTypes.STRING
			},
			designation: {
				type: DataTypes.STRING
			},
			total_hours: {
				type: DataTypes.INTEGER
			},
			partial_hours: {
				type: DataTypes.INTEGER
			},
			serial_number: {
				type: DataTypes.STRING,
				unique: true
			},
			origin: {
				type: DataTypes.STRING
			},
			manuf_date: {
				type: DataTypes.DATE
			},
			service_date: {
				type: DataTypes.DATE
			},
			power: {
				type: DataTypes.INTEGER
			},
			weight: {
				type: DataTypes.INTEGER
			},
			price: {
				type: DataTypes.INTEGER
			},
			observations: {
				type: DataTypes.TEXT
			},
			site_importance: {
				type: DataTypes.INTEGER
			},
			next_maintenance: {
				type: DataTypes.VIRTUAL
			},
			construction_site_id: {
				type: DataTypes.INTEGER,
				references: {
				model: 'construction_site',
				key: 'id'
				}
			},
			lubrication_sheet_id: {
				type: DataTypes.INTEGER,
				references: {
				model: 'lubrication_sheet',
				key: 'id'
				}
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
			modelName: 'equipment',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return Equipment;
	}
}