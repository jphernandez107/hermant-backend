const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MaintenanceFrequency extends Model {
        static associate(models) {
            MaintenanceFrequency.belongsTo(models.lubrication_sheet, {
                foreignKey: 'lubrication_sheet_id',
                onDelete: 'CASCADE'
            });
            MaintenanceFrequency.hasMany(models.maintenance, {
				as: 'maintenances',
				foreignKey: "maintenance_frequency_id"
			})
        }
    };
    MaintenanceFrequency.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        frequency: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lubrication_sheet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "lubrication_sheet",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
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
        modelName: 'maintenance_frequency',
        freezeTableName: true,
        timestamps: false
    });

    return MaintenanceFrequency
}