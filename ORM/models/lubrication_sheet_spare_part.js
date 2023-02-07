const { Model, Sequelize } = require('sequelize');
//LubricSheetRow
module.exports = (sequelize, DataTypes) => {
    class LubricationSheetSparePart extends Model {
        static associate(models) {
            LubricationSheetSparePart.belongsTo(models.spare_part, {
                foreignKey: 'spare_part_id',
                onDelete: 'CASCADE'
            });
            LubricationSheetSparePart.belongsTo(models.lubrication_sheet, {
                foreignKey: 'lubrication_sheet_id',
                onDelete: 'CASCADE'
            });
        }
    };
    LubricationSheetSparePart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        modelName: 'lubrication_sheet_spare_part',
        freezeTableName: true,
        timestamps: false
    });

    return LubricationSheetSparePart
}