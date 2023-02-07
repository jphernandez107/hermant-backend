const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EquipmentConstructionSite extends Model {
        static associate(models) {
            EquipmentConstructionSite.belongsTo(models.construction_site, {
                foreignKey: 'construction_site_id',
                onDelete: 'CASCADE'
            });
            EquipmentConstructionSite.belongsTo(models.equipment, {
                foreignKey: 'equipment_id',
                onDelete: 'CASCADE'
            });
        }
    };
    EquipmentConstructionSite.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        construction_site_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "construction_site",
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
        modelName: 'equipment_construction_site',
        freezeTableName: true,
        timestamps: false
    });

    return EquipmentConstructionSite
}