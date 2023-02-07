'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class LubricationSheet extends Model {
		static associate(models) {
			LubricationSheet.hasMany(models.equipment, {
				as: 'equipments',
				foreignKey: "lubrication_sheet_id"
			})
			LubricationSheet.hasMany(models.lubrication_sheet_spare_part, {
				as: 'lubrication_sheet_spare_parts',
				foreignKey: "lubrication_sheet_id"
			})
		}
	}
	LubricationSheet.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
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
		modelName: 'lubrication_sheet',
		freezeTableName: true,
		timestamps: false
	});

	return LubricationSheet;
}
