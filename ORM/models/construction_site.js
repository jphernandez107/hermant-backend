'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ConstructionSite extends Model {
		static associate(models) {
			ConstructionSite.belongsToMany(models.equipment, {
				through: models.equipment_construction_site,
				as: 'equipments',
				foreignKey: "construction_site_id"
			})
		}
	}
	ConstructionSite.init({
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
		name: {
			type: DataTypes.STRING,
		},
		district: {
			type: DataTypes.STRING,
		},
		province: {
			type: DataTypes.STRING,
		},
		init_date: {
			type: DataTypes.DATE,
		},
		finish_date: {
			type: DataTypes.DATE,
		},
		max_temp: {
			type: DataTypes.FLOAT,
		},
		min_temp: {
			type: DataTypes.FLOAT,
		},
		altitude: {
			type: DataTypes.FLOAT,
		},
		dust: {
			type: DataTypes.FLOAT,
		},
		distance: {
			type: DataTypes.FLOAT,
		},
		observations: {
			type: DataTypes.STRING,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
			onUpdate: Sequelize.NOW
		}
	}, {
		sequelize,
		modelName: 'construction_site',
		freezeTableName: true,
		timestamps: false
	});

	return ConstructionSite;
}
