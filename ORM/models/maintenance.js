'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Maintenance extends Model {
		static associate(models) {
			Maintenance.hasMany(models.maintenance_spare_part, {
				as: 'maintenance_spare_parts',
				foreignKey: "maintenance_id"
			})
            Maintenance.belongsTo(models.equipment, {
                foreignKey: 'equipment_id',
                onDelete: 'CASCADE'
            });
            Maintenance.belongsTo(models.maintenance_frequency, {
                as: "maintenance_frequency",
                foreignKey: 'maintenance_frequency_id'
            });
		}
	}
	Maintenance.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
        equipment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "equipment",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        },
        maintenance_frequency_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "maintenance_frequency",
                key: "id"
            },
            onUpdate: "cascade"
        },
        equipment_partial_hours:{
            type: DataTypes.INTEGER
        },
        equipment_total_hours:{
            type: DataTypes.INTEGER
        },
        maintenance_cost: {
            type: DataTypes.FLOAT
        },
        maintenance_duration: {
            type: DataTypes.INTEGER
        },
        maintenance_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        observations:{
            type: DataTypes.STRING
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
		modelName: 'maintenance',
		freezeTableName: true,
		timestamps: false
	});

	return Maintenance;
}
