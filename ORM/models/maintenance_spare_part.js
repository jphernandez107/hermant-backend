const { Model, Sequelize } = require('sequelize');
//LubricSheetRow
module.exports = (sequelize, DataTypes) => {
    class MaintenanceSparePart extends Model {
        static associate(models) {
            MaintenanceSparePart.belongsTo(models.spare_part, {
                foreignKey: 'spare_part_id',
                onDelete: 'CASCADE'
            });
            MaintenanceSparePart.belongsTo(models.maintenance, {
                foreignKey: 'maintenance_id',
                onDelete: 'CASCADE'
            });
        }
    };
    MaintenanceSparePart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "maintenance",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        },
        spare_part_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "spare_part",
                key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        application: {
            type: DataTypes.STRING
        },
        partial_cost: {
            type: DataTypes.FLOAT
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
        modelName: 'maintenance_spare_part',
        freezeTableName: true,
        timestamps: false
    });

    return MaintenanceSparePart
}