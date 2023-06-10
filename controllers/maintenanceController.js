const models = require("../ORM/models");
const Maintenance = models.maintenance;
const MaintenanceSparePart = models.maintenance_spare_part;
const MaintenanceFrequency = models.maintenance_frequency;
const NextMaintenance = models.next_maintenance;
const EquipmentHour = models.equipment_hour;
const commonController = require("./commonController");
const equipmentController = require("./equipmentController");
const sparePartController = require("./sparePartController");

const { Utils } = require("../utils/utils");

const uts = require("../utils/utils");

const MAINTENANCE_NOT_FOUND = `Maintenance not found.`;
const FREQUENCY_NOT_FOUND = `Maintenance frequency not found.`;
const ERROR_CREATING_MAINTENANCE = `Error creating a maintenance.`;
const ERROR_CREATING_MAINTENANCE_ROWS = `Error creating maintenance rows`;

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
	let body = req.body;

	let bodyMessage = validateBody(body);
	if (bodyMessage)
		Utils.errorResponse(res, { error: bodyMessage }, bodyMessage, 400);

	let equipmentQuery = {
		id: body.equipment_id,
		code: body.equipment_code,
	};

	let maintenance_date = body.maintenance_date
		? body.maintenance_date
		: new Date();
	let reset_equipment_partial_hours = body.reset_equipment_partial_hours !== undefined
		? body.reset_equipment_partial_hours
		: true;

	const transaction = await Maintenance.sequelize.transaction();
	try {
		const equipment = await commonController.findEquipmentByIdOrCode(
			equipmentQuery
		);
		if (!equipment)
			throw Utils.throwError(
				404,
				equipmentController.EQUIPMENT_NOT_FOUND
			);
		const maintenanceFrequency = await getMaintenanceFrequency(
			equipment.lubrication_sheet_id,
			body.maintenance_frequency
		);
		if (!maintenanceFrequency)
			throw Utils.throwError(404, FREQUENCY_NOT_FOUND);
		const maintenance = await Maintenance.create({
			maintenance_frequency_id: maintenanceFrequency.id,
			equipment_id: equipment.id,
			maintenance_date: maintenance_date,
			equipment_total_hours: equipment.total_hours,
			equipment_partial_hours: equipment.partial_hours,
			maintenance_cost: 0,
			maintenance_duration: body.maintenance_duration,
			observations: body.observations ? body.observations : null,
		});
		if (!maintenance) throw Utils.throwError(404, MAINTENANCE_NOT_FOUND);
		const spareParts = await getSpareParts(body.spare_parts);
		if (!spareParts)
			throw Utils.throwError(404, sparePartController.PART_NOT_FOUND);
		const partsWithCosts = getPartialCostForRow(
			spareParts,
			body.spare_parts
		);
		const successResponse = await createMaintenanceRows(
			partsWithCosts,
			res,
			equipment,
			maintenance
		);
		if (reset_equipment_partial_hours) {
			equipment.partial_hours = 0;
			await equipment.save();
		}
		Utils.successResponse(res, successResponse);
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		catchError(res, error, ERROR_CREATING_MAINTENANCE);
	}
};

async function createMaintenanceRows(
	spare_parts_with_costs,
	res,
	equipment,
	maintenance
) {
	let rows = getRowsFromQuery(spare_parts_with_costs, maintenance.id);

	const maintenanceRows = await MaintenanceSparePart.bulkCreate(rows);
	if (!rows) throw Utils.throwError(400, ERROR_CREATING_MAINTENANCE_ROWS);
	const totalCost = getMaintenanceCostFromSpareParts(spare_parts_with_costs);
	maintenance.maintenance_cost = totalCost;
	maintenance = await maintenance.save();
	equipment.addMaintenances(maintenance);
	return {
		message: `Maintenance ${maintenance.id} with ${maintenanceRows.length} rows created and added to equipment ${equipment.code} succesfully with a total cost of ${maintenance.maintenance_cost}.`,
		maintenance_id: maintenance.id,
		equipment_id: equipment.id,
		maintenance_spare_parts: maintenanceRows,
	};
}

function getRowsFromQuery(sparePartQuery, maintenance_id) {
	let maintenanceRows = [];
	sparePartQuery.forEach((part) => {
		maintenanceRows.push({
			maintenance_id: maintenance_id,
			spare_part_id: part.spare_part_id,
			quantity: part.quantity,
			application: part.application,
			partial_cost: part.partial_cost,
		});
	});
	return maintenanceRows;
}

async function getMaintenanceFrequency(sheet_id, frequency) {
	return MaintenanceFrequency.findOne({
		where: {
			lubrication_sheet_id: sheet_id,
			frequency: frequency,
		},
	});
}

async function getSpareParts(sparePartQuery) {
	const ids = sparePartQuery.map((part) => part.spare_part_id);
	const query = { id: ids };
	return await sparePartController.findSpareParts(query);
}

function getMaintenanceCostFromSpareParts(sparePartQuery) {
	return sparePartQuery.reduce((acc, curr) => {
		acc += curr.partial_cost;
		return acc;
	}, 0);
}

function getPartialCostForRow(parts, sparePartQuery) {
	return sparePartQuery.map((item) => {
		const sparePart = parts.find((sp) => sp.id === item.spare_part_id);
		if (sparePart) item.partial_cost = sparePart.unit_price * item.quantity;
		else item.partial_cost = 0;
		return item;
	});
}

async function updateNextMaintenancesForEquipment(equipment) {
	await NextMaintenance.destroy({
		where: {
			equipment_id: equipment.id,
		},
	});
	let averageUseHours = 12;
	const equipmentHours = await EquipmentHour.findAll({
		where: {
			equipment_id: equipment.id,
		},
	});

	if (equipmentHours) averageUseHours = getAverageUseHours(equipmentHours);

	const lubrication_sheet_id = equipment.lubrication_sheet_id;
	const maintenance_frequencies =
		await findMaintenanceFrequenciesForLubricationSheet(
			lubrication_sheet_id
		);
	if (!maintenance_frequencies)
		Utils.throwError(404, `Frequencies not found.`);

	const next_maintenances = getNextMaintenances(
		maintenance_frequencies,
		equipment,
		averageUseHours
	);
	if (!next_maintenances)
		Utils.throwError(
			500,
			`Error trying to calculate the next maintenance dates.`
		);
	await NextMaintenance.bulkCreate(next_maintenances);
}

async function findMaintenanceFrequenciesForLubricationSheet(
	lubrication_sheet_id
) {
	const frequencies = await MaintenanceFrequency.findAll({
		where: {
			lubrication_sheet_id: lubrication_sheet_id,
		},
	});
	return frequencies;
}

function getAverageUseHours(equipmentHours) {
	const currentDate = new Date();
	const thirtyDaysAgo = new Date(
		currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
	);

	const dailyHours = new Map();
	equipmentHours.forEach((useHour) => {
		if (useHour.date >= thirtyDaysAgo) {
			const dateStr = useHour.date.toISOString().slice(0, 10);
			dailyHours.set(
				dateStr,
				(dailyHours.get(dateStr) || 0) + useHour.hours_to_add
			);
		}
	});

	const dailyHoursArray = Array.from(dailyHours.values());
	const totalHours = dailyHoursArray.reduce((acc, hours) => acc + hours, 0);
	return Math.ceil(totalHours / dailyHoursArray.length);
}

function getNextMaintenances(
	maintenance_frequencies,
	equipment,
	averageUseHours
) {
	const frequencies = maintenance_frequencies
		.map((freq) => freq.frequency)
		.sort((a, b) => a - b);
	if (!frequencies || frequencies.length <= 0) return;
	const NUMBER_OF_MAINTENANCES_TO_CREATE = 10;

	let partial_hours = equipment.partial_hours;
	const startIndex = frequencies.findIndex((x) => x >= partial_hours);
	const rotatedFrequencies = frequencies
		.slice(startIndex)
		.concat(frequencies.slice(0, startIndex));

	const maxFreq = maintenance_frequencies.max();
	const next_maintenances = [];

	let nextMaint = 0;
	let accFreq = 0;
	while (
		next_maintenances.length < NUMBER_OF_MAINTENANCES_TO_CREATE &&
		rotatedFrequencies.length > 0
	) {
		let frequency = rotatedFrequencies[nextMaint];
		if (accFreq < maxFreq) accFreq = frequency;
		else accFreq += frequency;
		const hoursToNextMaint = accFreq - partial_hours;
		const daysToNextMaint = hoursToNextMaint / averageUseHours;
		const today = new Date();
		const nextMaintenanceDate = today.addDays(daysToNextMaint);

		const freqId = maintenance_frequencies.find(
			(f) => parseInt(f.frequency) === parseInt(frequency)
		);

		next_maintenances.push({
			equipment_id: equipment.id,
			maintenance_frequency_id: freqId.id,
			maintenance_date: nextMaintenanceDate,
		});

		nextMaint++;
		if (nextMaint === rotatedFrequencies.length) {
			nextMaint = 0;
		}
	}
	return next_maintenances;
}

/**
 *
 * @param {*} body
 * Validates body structure
 * {
 *   "maintenance_frequency": 400,
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
	const requiredFields = [
		"maintenance_frequency",
		"equipment_code",
		"spare_parts",
	];
	const sparePartFields = ["spare_part_id", "quantity", "application"];

	for (const field of requiredFields) {
		if (!body.hasOwnProperty(field))
			return `Missing required field: ${field}`;
	}

	if (!Array.isArray(body.spare_parts) || body.spare_parts.length === 0)
		return "spare_parts must be a non-empty array";

	for (const sparePart of body.spare_parts) {
		for (const field of sparePartFields) {
			if (!sparePart.hasOwnProperty(field)) {
				return `spare_parts must contain objects with properties: ${sparePartFields.join(
					", "
				)}`;
			}
		}

		if (typeof sparePart.spare_part_id !== "number")
			return "spare_part_id must be a number";
		if (typeof sparePart.quantity !== "number")
			return "quantity must be a number";
		if (typeof sparePart.application !== "string")
			return `application must be a string`;
	}

	return null;
}

function catchError(res, error, message) {
	console.log(error);
	res.status(400).json({
		message,
		error,
	});
}

module.exports = {
	createMaintenance,
	updateNextMaintenancesForEquipment,
};
