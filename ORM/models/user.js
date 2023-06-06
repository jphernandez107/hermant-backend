'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// Associations can be defined here
		}
	}
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
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			onUpdate : sequelize.literal('CURRENT_TIMESTAMP')
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
		timestamps: false
	});

	return User;
}
