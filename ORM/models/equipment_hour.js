'use strict';
const { Model, Sequelize } = require('sequelize');
const ConstructionSite = require('./construction_site')
const Equipment = require('./equipment')

module.exports = (sequelize, DataTypes) => {
	class EquipmentHour extends Model {
		static associate(models) {
			EquipmentHour.belongsTo(models.equipment, {
				as: 'equipment',
				foreignKey: "equipment_id"
			})
			EquipmentHour.belongsTo(models.construction_site, {
				as: 'construction_site',
				foreignKey: "construction_site_id"
			})
		}
	}
	EquipmentHour.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		hours_to_add: {
			type: DataTypes.INTEGER
		},
		total_hours: {
			type: DataTypes.INTEGER
		},
		partial_hours: {
			type: DataTypes.INTEGER
		},
		date: {
			type: DataTypes.DATE,
		},
		observations: {
			type: DataTypes.TEXT
		},
		equipment_id: {
			type: DataTypes.INTEGER,
			references: {
				model: 'equipment',
				key: 'id'
			}
		},
		construction_site_id: {
			type: DataTypes.INTEGER,
			references: {
				model: 'construction_site',
				key: 'id'
			}
		},
		user_id: {
			type: DataTypes.INTEGER
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
		modelName: 'equipment_hour',
		freezeTableName: true,
		timestamps: false
	});

	return EquipmentHour;
}
