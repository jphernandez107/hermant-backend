const models = require("../ORM/models");
const LubricationSheet = models.lubrication_sheet;
const LubricationSheetSparePart = models.lubrication_sheet_spare_part;
const MaintenanceFrequency = models.maintenance_frequency;
const commonController = require("./commonController");
const maintenanceController = require("./maintenanceController");

const { Utils } = require("../utils/utils");

const LUBRICATION_SHEET_NOT_FOUND = `Lubrication sheet not found.`;
const ERROR_CREATING_LUBRICATION_SHEET = `Error creating lubrication sheet.`;
const SHEET_CREATED = `Lubrication Sheet created succesfully.`;
const SHEET_DELETED = `Lubrication Sheet deleted succesfully.`;
const ERROR_DELETING_SHEET = `Error deleting lubrication sheet.`;
const ERROR_CREATING_SHEET_ROWS = `Error creating sheet rows.`;
const ERROR_CREATING_MAINTENANCE_FREQUENCIES = `Error creating maintenance frequencies.`;

const getLubricationSheetList = async (req, res) => {
	try {
		const sheets = await LubricationSheet.findAll({
			include: LubricationSheet.includes,
		});
		if (!sheets) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND);
		return res.status(200).json(sheets);
	} catch (error) {
		catchError(res, error, "Error retreiving sheets.");
	}
};

const getLubricationSheetById = async (req, res) => {
	try {
		const sheet = await commonController.findLubricationSheetById(
			req.query
		);
		if (!sheet) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND);
		return res.status(200).json(sheet);
	} catch (error) {
		catchError(res, error, LUBRICATION_SHEET_NOT_FOUND);
	}
};

const getLubricationSheetByEquipmentCode = async (req, res) => {
	try {
		const sheet = await findLubricationSheetByEquipmentCode(req.query);
		if (!sheet) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND);
		return res.status(200).json(sheet);
	} catch (error) {
		catchError(res, error, LUBRICATION_SHEET_NOT_FOUND);
	}
};

const findLubricationSheetByEquipmentCode = async (query) => {
	const include = JSON.parse(JSON.stringify(LubricationSheet.includes));
	include[0].where = {
		code: query.equipment_code,
	};
	const sheet = await LubricationSheet.findOne({
		include: include,
	});
	return sheet;
};

const createNewLubricationSheet = async (req, res) => {
	let equipmentQuery = {
		id: req.query.id,
		code: req.query.code,
	};
	console.log(equipmentQuery);
	try {
		const equipment = await commonController.findEquipmentByIdOrCode(
			equipmentQuery
		);
		if (!equipment)
			return res
				.status(404)
				.send(equipmentController.EQUIPMENT_NOT_FOUND);
		const sheet = await LubricationSheet.create();
		if (!sheet)
			return res.status(404).send(ERROR_CREATING_LUBRICATION_SHEET);
		sheet.addEquipments(equipment);
		return res.status(200).json({
			message: SHEET_CREATED,
			lubrication_sheet: sheet,
		});
	} catch (error) {
		console.log("Creating lubrication sheet :");
		console.error(error);
		catchError(res, error, ERROR_CREATING_LUBRICATION_SHEET);
	}
};

const deleteLubricationSheetById = async (req, res) => {
	try {
		const sheet = await commonController.findLubricationSheetById(
			req.query
		);
		if (!sheet) return res.status(404).send(LUBRICATION_SHEET_NOT_FOUND);
		await sheet.destroy();
		return res.status(200).json({
			message: SHEET_DELETED,
			sheet: sheet,
		});
	} catch (error) {
		catchError(res, error, ERROR_DELETING_SHEET);
	}
};

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
	let body = req.body;

	let bodyMessage = Utils.validateBody(body);
	if (bodyMessage)
		Utils.errorResponse(res, { error: bodyMessage }, bodyMessage, 400);

	let sheetQuery = {
		id: body.lubrication_sheet_id,
	};
	let equipmentQuery = {
		id: body.equipment_id,
		code: body.equipment_code,
	};

	if (body.lubrication_sheet_id)
		await clearLubricationSheet(sheetQuery)

	try {
		const equipment = await commonController.findEquipmentByIdOrCode(
			equipmentQuery
		);
		if (!equipment)
			return res
				.status(404)
				.send(equipmentController.EQUIPMENT_NOT_FOUND);
		const sheet = await findOrCreateLubricationSheet(sheetQuery);
		if (!sheet)
			return res.status(404).send(ERROR_CREATING_LUBRICATION_SHEET);
		const frequencies = await createMaintenanceFrequencies(
			body.frequencies,
			sheet.id
		);
		if (!frequencies)
			return res.status(404).send(ERROR_CREATING_MAINTENANCE_FREQUENCIES);
		const sheetRows = await createLubricationSheetRows(
			body.spare_parts,
			sheet.id
		);
		if (!sheetRows) return res.status(404).send(ERROR_CREATING_SHEET_ROWS);
		await linkMaintenanceFrequenciesToLubricationSheetSpareParts(
			body.spare_parts,
			frequencies,
			sheetRows
		);
		await maintenanceController.updateNextMaintenancesForEquipment(sheet.equipments);
		sheet.addEquipments(equipment);
		return Utils.successResponse(res, {
			message: `Lubrication Sheet ${sheet.id} with ${sheetRows.length} rows created and added to equipment ${equipment.code} succesfully.`,
			lubrication_sheet_id: sheet.id,
			equipment_id: equipment.id,
			lubrication_sheet_spare_parts: sheetRows,
		});
	} catch (error) {
		console.log("AddSparePartToLubricationSheet :");
		console.error(error);
		catchError(res, error, ERROR_CREATING_LUBRICATION_SHEET);
	}
};

async function clearLubricationSheet(sheetQuery) {
	try {
		await maintenanceController.removeMaintenanceFrequenciesForLubricationSheetId(sheetQuery.id);
		await removeLubricationSheetSparePartByLubricationSheetId(sheetQuery.id);
	} catch (error) {
		console.log("clearLubricationSheet ~ error:", error)
		return;
	}
}

async function removeLubricationSheetSparePartByLubricationSheetId(sheet_id) {
	await LubricationSheetSparePart.destroy({
		where: {
			lubrication_sheet_id: sheet_id,
		},
	});
}

function whereIdOrCode(query) {
	let where = {};
	if (query.code !== undefined) {
		where = {
			code: query.code,
		};
		return where;
	} else {
		where = {
			id: query.id,
		};
		return where;
	}
}

async function findOrCreateLubricationSheet(query) {
	if (query.id !== undefined && typeof query.id === "number") {
		return await LubricationSheet.findOne({
			where: whereIdOrCode(query),
			include: LubricationSheet.includes
		});
	} else {
		return await LubricationSheet.create();
	}
}

async function createMaintenanceFrequencies(frequencies, sheet_id) {
	const freqs = frequencies.map((freq) => {
		return {
			lubrication_sheet_id: sheet_id,
			frequency: freq,
		};
	});
	return await MaintenanceFrequency.bulkCreate(freqs);
}

async function linkMaintenanceFrequenciesToLubricationSheetSpareParts(
	spare_parts,
	frequencies,
	sheet_rows
) {
	for (let i=0; i < spare_parts.length; i++) {
		const part = spare_parts[i];
		const freqs = frequencies.filter((freq) =>
			part.frequencies.includes(freq.frequency)
		);
		await sheet_rows
			.find((row) => {
				return row.spare_part_id === part.spare_part_id
					&& row.application === part.application
					&& row.quantity === part.quantity
			})
			.addFrequencies(freqs);
	};
}

async function createLubricationSheetRows(spare_parts, sheet_id) {
	let sheetRows = getSheetRowsFromQuery(spare_parts, sheet_id);
	return await LubricationSheetSparePart.bulkCreate(sheetRows);
}

function getSheetRowsFromQuery(sparePartQuery, sheet_id) {
	let sheetRows = [];
	sparePartQuery.forEach((part) => {
		sheetRows.push({
			lubrication_sheet_id: sheet_id,
			spare_part_id: part.spare_part_id,
			quantity: part.quantity,
			application: part.application,
		});
	});
	return sheetRows;
}

function catchError(res, error, message) {
	console.log(error);
	res.status(400).json({
		message,
		error,
	});
}

module.exports = {
	LUBRICATION_SHEET_NOT_FOUND,
};

module.exports = {
	getLubricationSheetList,
	getLubricationSheetById,
	createNewLubricationSheet,
	deleteLubricationSheetById,
	addSparePartToLubricationSheet,
	getLubricationSheetByEquipmentCode,
};
