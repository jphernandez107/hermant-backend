const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MaintenanceFrequencyLubricationSheetSparePart extends Model {
        static associate(models) {
            MaintenanceFrequencyLubricationSheetSparePart.belongsTo(models.lubrication_sheet_spare_part, {
                foreignKey: 'lubrication_sheet_spare_part_id',
                onDelete: 'CASCADE'
            });
            MaintenanceFrequencyLubricationSheetSparePart.belongsTo(models.maintenance_frequency, {
                foreignKey: 'maintenance_frequency_id',
                onDelete: 'CASCADE'
            });
        }
    };
    MaintenanceFrequencyLubricationSheetSparePart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maintenance_frequency_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "maintenance_frequency",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        },
        lubrication_sheet_spare_part_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "lubrication_sheet_spare_part",
                key: "id"
            }
        },
        replace: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        modelName: 'maintenance_frequency_lubrication_sheet_spare_part',
        freezeTableName: true,
        timestamps: false
    });

    return MaintenanceFrequencyLubricationSheetSparePart
}