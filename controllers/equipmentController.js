const { Utils } = require('../utils/utils');
const models = require('../ORM/models');
const Equipment = models.equipment;
const ConstructionSite = models.construction_site
const Maintenance = models.maintenance
const MaintenanceFrequency = models.maintenance_frequency
const EquipmentHour = models.equipment_hour;
const NextMaintenance = models.next_maintenance;
const maintenanceController = require('./maintenanceController')

const includes = [
    {
        model: ConstructionSite,
        as: 'construction_sites'
    },
    {
        model: Maintenance,
        as: 'maintenances',
        include: [
            {
                model: MaintenanceFrequency,
                as: 'maintenance_frequency'
            }
        ]
    },
    {
        model: NextMaintenance,
        as: 'next_maintenances'
    },
];

const EQUIPMENT_NOT_FOUND = `Equipment not found.`
const ERROR_CREATING_EQUIPMENT = `Error creating new equipment.`
const EQUIPMENT_DELETED = `Equipment deleted successfully.`
const EQUIPMENT_CREATED = `Equipment added successfully.`
const EQUIPMENT_UPDATED = `Equipment added successfully.`
const ERROR_CREATING_EQUIPMENT_HOUR = `Error creating new equipment hour.`
const CANNOT_ADD_NEGATIVE_HOURS = `Cannot add negative use hours.`
const ERROR_UPDATING_EQUIPMENT = `Error updating equipment.`

const getEquipmentsList = async (req, res) => {
    try {
        const equipments = await Equipment
        .findAll({
            include: includes
        })
        if (!equipments) return res.status(404).send(EQUIPMENT_NOT_FOUND)
        equipments.forEach((equipment) => {
            const firstMaint = equipment.next_maintenances.map((maint) => new Date(maint.maintenance_date)).min()
            const next_maintenance = firstMaint ? new Date(firstMaint) : undefined;
            equipment.dataValues.next_maintenance = next_maintenance ? next_maintenance.toLocaleDateString() : undefined;
        })
        return res.status(200).json(equipments)
    } catch (error) {
        catchError(res, error, EQUIPMENT_NOT_FOUND)
    }
}

const getEquipmentByIdOrCode = async (req, res) => {
    try {
        const equipment = await findEquipmentByIdOrCode(req.query)
        if (!equipment) return res.status(404).send (EQUIPMENT_NOT_FOUND)
        return res.status(200).json(equipment)
    } catch (error) {
        Utils.errorResponse(res, error, "", 400)
    }
}

/**
 * Finds a single equipment record based on the query parameters.
 * 
 * @param {Object} query Example: code=FDR223&id=2
 * @returns {Equipment} equipment - A single equipment record from database
 */
async function findEquipmentByIdOrCode(query) {
    const equipment = await Equipment.findOne ({
        include: includes,
        where: whereIdOrCode(query)
    })
    const next_maintenance = new Date(equipment.next_maintenances.map((maint) => new Date(maint.maintenance_date)).min());
    equipment.dataValues.next_maintenance = next_maintenance.toLocaleDateString();
    return equipment
}

const postNewEquipment = async (req, res) => {
    try {
        let body = req.body
        const equipment = await Equipment.create(body)

        if (!equipment) return res.status(404).send (ERROR_CREATING_EQUIPMENT)
        return res.status(200).json({
            message: EQUIPMENT_CREATED,
            equipment: equipment
        })
    } catch (error) {
        let errorMessage = error.errors[0].message
        catchError(res, error, `Error adding a new equipment: ${errorMessage}`)
    }
}

const deleteEquipment = async (req, res) => {
    try {
        const equipment = await findEquipmentByIdOrCode(req.query)
        if (!equipment) return res.status(404).send (EQUIPMENT_NOT_FOUND)
        await equipment.destroy()
        return res.status(200).json({
            message: EQUIPMENT_DELETED,
            equipment: equipment
        })
    } catch (error) {
        catchError(res, error, "Error trying to delete equipment.")
    }
}

const updateEquipment = async (req, res) => {
    let body = req.body
    try {
        const equipment = await findEquipmentByIdOrCode(req.query)
        if (!equipment) return res.status(404).send (EQUIPMENT_NOT_FOUND)
        await equipment.update(body)
        return res.status(200).json({
            message: EQUIPMENT_UPDATED,
            equipment: equipment
        })
    } catch (error) {
        catchError(res, error, "Error trying to update equipment.")
    }
}

const addUseHours = async (req, res) => {
    const body = req.body
    const equipmentQuery = {
        id: req.query.id,
        code: req.query.code
    }
    let equipmentHourBody = {
        hours_to_add: parseInt(body.hours_to_add),
        date: body.date,
        observations: body.observations,
        user_id: body.user_id || 0
    }
    try {
        if (equipmentHourBody.hours_to_add < 0) return res.status(400).send(CANNOT_ADD_NEGATIVE_HOURS);

        const equipment = await findEquipmentByIdOrCode(equipmentQuery);
        if (!equipment) return res.status(404).send(EQUIPMENT_NOT_FOUND);

        const site = equipment.construction_sites[0]

        equipmentHourBody.equipment_id = equipment.id;
        equipmentHourBody.construction_site_id = site ? site.id : null;
        equipmentHourBody.total_hours = equipment.total_hours;
        equipmentHourBody.partial_hours = equipment.partial_hours;
        const equipment_hour = await EquipmentHour.create(equipmentHourBody)
        if(!equipment_hour) return res.status(400).send(ERROR_CREATING_EQUIPMENT_HOUR)

        const total = equipment.total_hours + equipment_hour.hours_to_add;
        const partial = equipment.partial_hours + equipment_hour.hours_to_add;

        const equipmentUpdated = await equipment.update({
            total_hours: total,
            partial_hours: partial
        });
        if (!equipmentUpdated) return res.status(404).send(ERROR_UPDATING_EQUIPMENT);

        if (equipmentUpdated.lubrication_sheet_id)
            await maintenanceController.updateNextMaintenancesForEquipment(equipmentUpdated);

        return res.status(200).json({
            message: `Equipment hour ${equipment_hour.id} added to equipment ${equipmentUpdated.code} succsesfully.`,
            site: site,
            equipment: equipmentUpdated,
            use_hour: equipment_hour
        })
    } catch (error) {
        catchError(res, error, "Error trying to add use hours to equipment.")
    }
}

// const addLubricationSheetToEquipment = async (req, res) => {
//     let body = req.body
//     try {
//         const equipment = await findEquipmentByIdOrCode(req.query)
//         if (!equipment) return res.status(404).send (EQUIPMENT_NOT_FOUND)
//         const lubrication_sheet = await LubricationSheetController.findLubricationSheetById({ id: body.lubrication_sheet_id })
//         if (!lubrication_sheet) return res.status(404).send(LubricationSheetController.LUBRICATION_SHEET_NOT_FOUND)
//         lubrication_sheet.addEquipments(equipment)
//         return res.status(200).json({
//             message: `Equipment ${equipment.code} added successfully to LubricationSheet with ID=${lubrication_sheet.id}`,
//             equipment: equipment
//         })
//     } catch (error) {
//         catchError(res, error, "Error trying to add lubrication sheet to equipment.")
//     }
// }

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

function catchError(res, error, message) {
    console.log(error)
    res.status(400).json({
        message,
        error
    })
}

module.exports = {
    EQUIPMENT_NOT_FOUND
}

module.exports = {
    getEquipmentsList,
    getEquipmentByIdOrCode,
    postNewEquipment,
    deleteEquipment,
    updateEquipment,
    // addLubricationSheetToEquipment,
    findEquipmentByIdOrCode,
    addUseHours
}
