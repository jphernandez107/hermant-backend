const models = require('../ORM/models')
const Maintenance = models.maintenance;
const MaintenanceSparePart = models.maintenance_spare_part
const equipmentController = require('./equipmentController')
const sparePartController = require('./sparePartController')

const { Utils } = require('../utils/utils')

const MAINTENANCE_NOT_FOUND = `Maintenance not found.`
const ERROR_CREATING_MAINTENANCE = `Error creating a maintenance.`
const ERROR_CREATING_MAINTENANCE_ROWS = `Error creating maintenance rows`

/**
 * 
 * @param {*} req:
 * {
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

const createMaintenance = async (req, res) => {
	let body = req.body

	let bodyMessage = validateBody(body)
	if (bodyMessage) Utils.errorResponse(res, { error: bodyMessage }, bodyMessage, 400)

	let equipmentQuery = {
		id: body.equipment_id,
		code: body.equipment_code
	}

	let maintenance_date = body.maintenance_date ? body.maintenance_date : new Date()

	try {
		const equipment = await equipmentController.findEquipmentByIdOrCode(equipmentQuery)
		if (!equipment) return res.status(404).send(equipmentController.EQUIPMENT_NOT_FOUND)
		const maintenance = await Maintenance.create({
			maintenance_frequency_id: body.maintenance_frequency_id,
			equipment_id: equipment.id,
			maintenance_date: maintenance_date,
			equipment_total_hours: equipment.total_hours,
			equipment_partial_hours: equipment.partial_hours,
			maintenance_cost: 0,
			maintenance_duration: 6,
			observations: body.observations ? body.observations : null
		})
		if (!maintenance) return res.status(404).send(MAINTENANCE_NOT_FOUND)
		const spareParts = await getSpareParts(body.spare_parts)
		if (!spareParts) return res.status(404).send(sparePartController.PART_NOT_FOUND)
		const partsWithCosts = getPartialCostForRow(spareParts, body.spare_parts)
		await createMaintenanceRows(partsWithCosts, res, equipment, maintenance)
	} catch (error) {
		catchError(res, error, ERROR_CREATING_MAINTENANCE)
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

async function createMaintenanceRows(spare_parts_with_costs, res, equipment, maintenance) {
	let rows = getRowsFromQuery(spare_parts_with_costs, maintenance.id)

	const maintenanceRows = await MaintenanceSparePart.bulkCreate(rows)
	if (!rows) return res.status(400).send(ERROR_CREATING_MAINTENANCE_ROWS)
	const totalCost = getMaintenanceCostFromSpareParts(spare_parts_with_costs)
	maintenance.maintenance_cost = totalCost
	maintenance = await maintenance.save()
	equipment.addMaintenances(maintenance)
	Utils.successResponse(res, {
		message: `Maintenance ${maintenance.id} with ${maintenanceRows.length} rows created and added to equipment ${equipment.code} succesfully with a total cost of ${maintenance.maintenance_cost}.`,
		maintenance_id: maintenance.id,
		equipment_id: equipment.id,
		maintenance_spare_parts: maintenanceRows
	})
}

function getRowsFromQuery(sparePartQuery, maintenance_id) {
	let maintenanceRows = []
	sparePartQuery.forEach((part) => {
		maintenanceRows.push({
			maintenance_id: maintenance_id,
			spare_part_id: part.spare_part_id,
			quantity: part.quantity,
			application: part.application,
			partial_cost: part.partial_cost
		})
	})
	return maintenanceRows
}

async function getSpareParts(sparePartQuery) {
	const ids = sparePartQuery.map((part) => part.spare_part_id)
	const query = { id: ids }
	return await sparePartController.findSpareParts(query)
}

function getMaintenanceCostFromSpareParts(sparePartQuery) {
	return sparePartQuery.reduce((acc, curr) => {
		acc += curr.partial_cost
		return acc
	}, 0)
}

function getPartialCostForRow(parts, sparePartQuery) {
	return sparePartQuery.map(item => {
		const sparePart = parts.find(sp => sp.id === item.spare_part_id)
		if (sparePart) item.partial_cost = sparePart.unit_price * item.quantity
		else item.partial_cost = 0
		return item
	})
}

 /**
     * 
     * @param {*} body 
     * Validates body structure
     * {
	 *   "maintenance_frequency_id": 2,
     *   "equipment_code": "EQ-01",
     *   "spare_parts": [
     *       { "spare_part_id": 22, "quantity": 3, "application": "Primary"},
     *       { "spare_part_id": 23, "quantity": 6, "application": "Secondary"},
     *       { "spare_part_id": 24, "quantity": 1, "application": "Primary"},
     *       { "spare_part_id": 25, "quantity": 7, "application": "Primary"}
     *   ]
     * }
     * @returns a string with an error message, or null if everything is fine
     */
  function validateBody(body) {
	const requiredFields = ["maintenance_frequency_id", "equipment_code", "spare_parts"];
	const sparePartFields = ["spare_part_id", "quantity", "application"];

	for (const field of requiredFields) {
		if (!body.hasOwnProperty(field)) return `Missing required field: ${field}`;
	}

	if (!Array.isArray(body.spare_parts) || body.spare_parts.length === 0) return "spare_parts must be a non-empty array";

	for (const sparePart of body.spare_parts) {
		for (const field of sparePartFields) {
			if (!sparePart.hasOwnProperty(field)) {
				return `spare_parts must contain objects with properties: ${sparePartFields.join(', ')}`;
			}
		}

		if (typeof sparePart.spare_part_id !== "number") return "spare_part_id must be a number";
		if (typeof sparePart.quantity !== "number") return "quantity must be a number";
		if (typeof sparePart.application !== "string") return `application must be a string`;
	}

	return null;
}

function catchError(res, error, message) {
    console.log(error)
    res.status(400).json({
        message,
        error
    })
}


module.exports = {
	createMaintenance
}