'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ConstructionSite extends Model {
		static associate(models) {
			ConstructionSite.hasMany(models.equipment, {
				as: 'equipments',
				foreignKey: 'construction_site_id',
			});
		}

		static includes = [
			{
				association: "equipments",
				include: [
					{
						association: 'next_maintenances',
						include: [
							{
								association: 'maintenance_frequency'
							}
						]
					}
				]
			},
		]
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
