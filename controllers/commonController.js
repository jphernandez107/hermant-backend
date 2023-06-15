const models = require('../ORM/models');
const Equipment = models.equipment;
const LubricationSheet = models.lubrication_sheet;
const ConstructionSite = models.construction_site;

/**
 * Finds a single equipment record based on the query parameters.
 * 
 * @param {Object} query Example: code=FDR223&id=2
 * @returns {Equipment} equipment - A single equipment record from database
 */
async function findEquipmentByIdOrCode(query) {
    const equipment = await Equipment.findOne ({
        include: Equipment.includes,
        where: whereIdOrCode(query)
    });
    const next_maintenance = new Date(equipment.next_maintenances.map((maint) => new Date(maint.maintenance_date)).min());
    equipment.dataValues.next_maintenance = next_maintenance.toLocaleDateString();
    return equipment;
}

/**
 * Finds a single site record based on the query parameters.
 * 
 * @param {Object} query Example: code=T01&id=2
 * @returns {Equipment} equipment - A single equipment record from database
 */
async function findSiteByIdOrCode(query) {
    const site = await ConstructionSite.findOne ({
        include: ConstructionSite.includes,
        order: [
            ['equipments', 'code', 'desc']
        ],
        where: whereIdOrCode(query)
    });
    return site;
}

/**
 * Finds a single lubrication sheet record based on the query parameters.
 * 
 * @param {Object} query Example: code=FDR223&id=2
 * @returns {LubricationSheet} lubricationSheet - A single lubrication sheet record from database
 */
async function findLubricationSheetById(query) {
    const lubricationSheet = await LubricationSheet.findOne ({
        include: LubricationSheet.includes,
        where: whereIdOrCode(query)
    })
    return lubricationSheet;
}

function whereIdOrCode(query) {
    console.log(query)
    let where = {}
    if (query.code !== undefined) {
        where = {
            code: query.code
        }
        return where
    } else {
        where = {
            id: query.id
        }
        return where
    }
}

module.exports = {
    findEquipmentByIdOrCode,
    findSiteByIdOrCode,
    findLubricationSheetById,
}
