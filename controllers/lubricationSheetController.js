const models = require('../ORM/models')
const LubricationSheet = models.lubrication_sheet;
const LubricationSheetSparePart = models.lubrication_sheet_spare_part
const equipmentController = require('./equipmentController')

const { Utils } = require('../utils/utils')

const includes = ['equipments', 'lubrication_sheet_spare_parts']

const LUBRICATION_SHEET_NOT_FOUND = `Lubrication sheet not found.`
const ERROR_CREATING_LUBRICATION_SHEET = `Error creating lubrication sheet.`
const SHEET_CREATED = `Lubrication Sheet created succesfully.`
const SHEET_DELETED = `Lubrication Sheet deleted succesfully.`
const ERROR_DELETING_SHEET = `Error deleting lubrication sheet.`
const ERROR_CREATING_SHEET_ROWS = `Error creating sheet rows.`

const getLubricationSheetList = async (req, res) => {
    try {
        const sheets = await LubricationSheet.findAll({
                include: includes,
                where: whereClause(req.query)
            })
        if (!sheets) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND)
        return res.status(200).json(sheets)
    } catch(error) {
        catchError(res, error, "Error retreiving sheets.")
    }
}

const getLubricationSheetById = async (req, res) => {
    try {
        const sheet = await findLubricationSheetById(req.query)
        if (!sheet) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND)
        return res.status(200).json(sheet)
    } catch (error) {
        catchError(res, error, LUBRICATION_SHEET_NOT_FOUND)
    }
}

/**
 * Finds a single lubrication sheet record based on the query parameters.
 * 
 * @param {Object} query Example: code=FDR223&id=2
 * @returns {LubricationSheet} lubricationSheet - A single lubrication sheet record from database
 */
 async function findLubricationSheetById(query) {
    const lubricationSheet = await LubricationSheet.findOne ({
        include: includes,
        where: whereId(query)
    })
    return lubricationSheet
}

const createNewLubricationSheet = async (req, res) => {
    let equipmentQuery = {
        id: req.query.id,
        code: req.query.code
    }
    console.log(equipmentQuery)
    try {
        const equipment = await equipmentController.findEquipmentByIdOrCode(equipmentQuery)
        if (!equipment) return res.status(404).send(equipmentController.EQUIPMENT_NOT_FOUND)
        const sheet = await LubricationSheet.create()
        if (!sheet) return res.status(404).send(ERROR_CREATING_LUBRICATION_SHEET)
        sheet.addEquipments(equipment)
        return res.status(200).json({
            message: SHEET_CREATED,
            lubrication_sheet: sheet
        })
    } catch (error) {
        catchError(res, error, ERROR_CREATING_LUBRICATION_SHEET)
    }
}

const deleteLubricationSheetById = async (req, res) => {
    try {
        const sheet = await findLubricationSheetById(req.query)
        if (!sheet) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND)
        await sheet.destroy()
        return res.status(200).json({
            message: SHEET_DELETED,
            sheet: sheet
        })
    } catch (error) {
        catchError(res, error, ERROR_DELETING_SHEET)
    }
}

/**
 * 
 * @param {*} req:
 * {
 *   ["lubrication_sheet_id": 23] // OPTIONAL
 *   "equipment_code": "EQ-01",
 *   "spare_parts": [
 *       { "spare_part_id": 22, "quantity": 3, "application": "Primary"},
 *       { "spare_part_id": 23, "quantity": 6, "application": "Secondary"},
 *       { "spare_part_id": 24, "quantity": 1, "application": "Primary"},
 *       { "spare_part_id": 25, "quantity": 7, "application": "Primary"}
 *   ]
 * }
 * @param {*} res 
 */

const addSparePartToLubricationSheet = async (req, res) => {
	let body = req.body

	let bodyMessage = Utils.validateBody(body)
	if (bodyMessage) Utils.errorResponse(res, { error: bodyMessage }, bodyMessage, 400)

	let sheetQuery = {
		id: body.lubrication_sheet_id
	}
	let equipmentQuery = {
		id: body.equipment_id,
		code: body.equipment_code
	}

    try {
        const equipment = await equipmentController.findEquipmentByIdOrCode(equipmentQuery)
        if (!equipment) return res.status(404).send(equipmentController.EQUIPMENT_NOT_FOUND)
        const sheet = await findOrCreateLubricationSheet(sheetQuery)
        if (!sheet) return res.status(404).send(ERROR_CREATING_LUBRICATION_SHEET)
        const sheetRows = await createLubricationSheetRows(body.spare_parts, sheet.id)
        if (!sheetRows) return res.status(404).send(ERROR_CREATING_SHEET_ROWS)
        sheet.addEquipments(equipment)
        return Utils.successResponse(res, {
            message: `Lubrication Sheet ${sheet.id} with ${sheetRows.length} rows created and added to equipment ${equipment.code} succesfully.`,
            lubrication_sheet_id: sheet.id,
            equipment_id: equipment.id,
            lubrication_sheet_spare_parts: sheetRows
        })
    } catch (error) {
        catchError(res, error, ERROR_CREATING_LUBRICATION_SHEET)
    }
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

async function findOrCreateLubricationSheet(query) {
	if (query.id !== undefined && typeof query.id === "number") {
		return await LubricationSheet.findOne({
            where: whereIdOrCode(query)
        })
	} else {
		return await LubricationSheet.create()
	}
}

async function createLubricationSheetRows(spare_parts, sheet_id) {
	let sheetRows = getSheetRowsFromQuery(spare_parts, sheet_id)
	return await  LubricationSheetSparePart.bulkCreate(sheetRows)
}

function getSheetRowsFromQuery(sparePartQuery, sheet_id) {
	let sheetRows = []
	sparePartQuery.forEach((part) => {
		sheetRows.push({
			lubrication_sheet_id: sheet_id,
			spare_part_id: part.spare_part_id,
			quantity: part.quantity,
			application: part.application
		})
	})
	return sheetRows
}

function whereClause(query) {
    return undefined
}

function whereId(query) {
    return {
        id: query.id
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
    LUBRICATION_SHEET_NOT_FOUND
}

module.exports = {
    getLubricationSheetList,
    getLubricationSheetById,
    createNewLubricationSheet,
    deleteLubricationSheetById,
    addSparePartToLubricationSheet,
    findLubricationSheetById
}

