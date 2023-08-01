'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class NextMaintenance extends Model {
		static associate(models) {
            NextMaintenance.belongsTo(models.equipment, {
                as: "equipment",
                foreignKey: 'equipment_id',
                onDelete: 'CASCADE'
            });
            NextMaintenance.belongsTo(models.maintenance_frequency, {
                as: "maintenance_frequency",
                foreignKey: 'maintenance_frequency_id'
            });
		}

        static includes = [
			{
				association: 'equipment'
			},
			{
				association: 'maintenance_frequency'
			}
		];
	}
	NextMaintenance.init({
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
        maintenance_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
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
		modelName: 'next_maintenance',
		freezeTableName: true,
		timestamps: false
	});

	return NextMaintenance;
}
