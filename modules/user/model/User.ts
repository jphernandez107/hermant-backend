import { Model, DataTypes, Sequelize, NOW } from 'sequelize';
import { UserAttributes, UserCreationAttributes, UserInstance } from './IUser';

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserInstance {
	public id!: number;
	public dni!: string;
	public password!: string;
	public password_salt!: string;
	public first_name!: string;
	public last_name!: string;
	public role!: 'Admin' | 'Engineer' | 'Mechanic' | 'Warehouse Manager';
	public created_at!: Date;
	public updated_at!: Date;
	public last_login?: Date;
	public password_reset_token?: string;
	public password_reset_token_expiry?: Date;
	public active!: boolean;

	static associate(models: any) {
		// Associations can be defined here
	}

	static initModel(sequelize: Sequelize) {
		User.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			dni: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			password_salt: {
				type: DataTypes.STRING,
				allowNull: false
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			role: {
				type: DataTypes.ENUM('Admin', 'Engineer', 'Mechanic', 'Warehouse Manager'),
				defaultValue: 'Mechanic'
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: NOW
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: NOW,
			},
			last_login: {
				type: DataTypes.DATE,
				defaultValue: null
			},
			password_reset_token: {
				type: DataTypes.STRING,
				defaultValue: null
			},
			password_reset_token_expiry: {
				type: DataTypes.DATE,
				defaultValue: null
			},
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		}, {
			sequelize,
			modelName: 'user',
			freezeTableName: true,
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});

		return User;
	}
}
