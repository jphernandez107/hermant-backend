'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class SparePart extends Model {
		static associate(models) {
			SparePart.hasMany(models.lubrication_sheet_spare_part, {
				as: 'lubrication_sheet_spare_parts',
				foreignKey: "spare_part_id"
			})
			SparePart.hasMany(models.maintenance_spare_part, {
				as: 'maintenance_spare_parts',
				foreignKey: "spare_part_id"
			})
		}
	}
	SparePart.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		internal_code: {
			type: DataTypes.STRING,
			unique: true,
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
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
			onUpdate: Sequelize.NOW
		}
	}, {
		sequelize,
		modelName: 'spare_part',
		freezeTableName: true,
		timestamps: false
	});

	return SparePart;
}
