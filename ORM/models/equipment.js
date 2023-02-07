'use strict';
const { Model, Sequelize } = require('sequelize');
const ConstructionSite = require('./construction_site')

module.exports = (sequelize, DataTypes) => {
	class Equipment extends Model {
		static associate(models) {
			Equipment.belongsToMany(models.construction_site, {
				through: models.equipment_construction_site,
				as: 'construction_sites',
				foreignKey: "equipment_id"
			})
			Equipment.belongsTo(models.lubrication_sheet, {
				as: 'lubrication_sheet'
			})
			Equipment.hasMany(models.maintenance, {
				as: 'maintenances',
				foreignKey: "equipment_id"
			})
		}
	}
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
		lubrication_sheet_id: {
			type: DataTypes.INTEGER,
			references: {
				model: 'lubrication_sheet',
				key: 'id'
			}
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
		modelName: 'equipment',
		freezeTableName: true,
		timestamps: false
	});

	return Equipment;
}
