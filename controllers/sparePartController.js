
const { Sequelize, Op } = require("sequelize");

const models = require('../ORM/models')
const SparePart = models.spare_part;

const PART_NOT_FOUND = `Part not found.`
const PART_CREATED = `Part created successfully.`
const ERROR_CREATING_PART = `Error creating part.`
const PART_DELETED = `Part deleted successfully.`
const ERROR_DELETING_PART = `Error deleting part.`
const PART_UPDATED = `Part updated successfully.`
const ERROR_UPDATING_PART = `Error updating part.`

const includes = []

const getSparePartList = async (req, res) => {
	try {
		const parts = await SparePart.findAll({
			where: whereIdOrCode(req.query)
		})
		if (!parts) return res.status(404).send(PART_NOT_FOUND)
		return res.status(200).json(parts)
 	} catch (error) {
		catchError(res, error, PART_NOT_FOUND)
	}
}

const getSparePartByIdOrCode = async (req, res) => {
	try {
        const part = await findSparePartByIdOrCode(req.query)
        if (!part) return res.status(404).send(PART_NOT_FOUND)
        return res.status(200).json(part)
    } catch (error) {
        catchError(res, error, PART_NOT_FOUND)
    }
}

/**
 * Finds a single part record based on the query parameters.
 * 
 * @param {Object} query
 * @returns {SparePart} SparePart - A single part record from database
 */
 async function findSparePartByIdOrCode(query) {
    const sparePart = await SparePart.findOne ({
        include: includes,
        where: whereOnlyIdOrOnlyCode(query)
    })
    return sparePart
}

/**
 * Finds array of part records based on the query parameters.
 * 
 * @param {Object} query
 * @returns {SparePart} SparePart - Array of part records from database
 */
 async function findSpareParts(query) {
    const spareParts = await SparePart.findAll ({
        include: includes,
        where: whereOnlyIdOrOnlyCode(query)
    })
    return spareParts
}

const createNewSparePart = async (req, res) => {
	let body = req.body
	try {
		const part = await SparePart.create(body)
		if (!part) return res.status(400).send(ERROR_CREATING_PART)
		return res.status(200).json({
			message: PART_CREATED,
			part: part
		})
	} catch (error) {
		catchError(res, error, ERROR_CREATING_PART)
	}
	
}

const deleteSparePart = async (req, res) => {
	let query = req.query
	try {
		const part = await findSparePartByIdOrCode(query)
		if (!part) return res.status(400).send(PART_NOT_FOUND)
		await part.destroy()
		return res.status(200).json({
			message: PART_DELETED,
			part: part
		})
	} catch (error) {
		catchError(res, error, ERROR_DELETING_PART)
	}
}

const updateSparePart = async (req, res) => {
	let body = req.body
	let query = req.query
	try {
		let part = await findSparePartByIdOrCode(query)
		if (!part) return res.status(400).send(PART_NOT_FOUND)
		part = await part.update(body)
		if (!part) return res.status(400).send(ERROR_UPDATING_PART)
		return res.status(200).json({
			message: PART_UPDATED,
			part: part
		})
	} catch (error) {
		catchError(res, error, ERROR_UPDATING_PART)
	}
}

/**
 * 
 * @param {*} query can contain id, internal_code and external_code
 * If we get more than one type, it only checks for one of them and 
 * the others gets ignored.
 * 
 * The priority is:
 * 1. id
 * 2. internal_code
 * 3. external_code
 * 
 * @returns a where statement filtering only for one parameter
 */
function whereOnlyIdOrOnlyCode(query) {
	let internalCodes = Array.isArray(query.internal_code) ? query.internal_code : [query.internal_code];
	let externalCodes = Array.isArray(query.external_code) ? query.external_code : [query.external_code];
	let ids = Array.isArray(query.id) ? query.id : [query.id];

	if (ids.length > 0 && ids[0] !== undefined) {
		return {
			id: ids[0]
		}
	}

	if (internalCodes.length > 0 && internalCodes[0] !== undefined) {
		return {
			internal_code: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('internal_code')), 'LIKE', `%${internalCodes[0].toLowerCase()}%`)
		}
	}

	if (externalCodes.length > 0 && externalCodes[0] !== undefined) {
		return {
			external_code: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('external_code')), 'LIKE', `%${externalCodes[0].toLowerCase()}%`)
		}
	}

	return {[Op.and]: [Sequelize.literal('1 = 0')]}
}

/**
 * 
 * @param {*} query can contain id, internal_code and external_code
 * wether array or single value.
 * 
 * @returns a where statement filtering for any of the parameters passed
 */

function whereIdOrCode(query) {
	let whereClause = {};
	let internalCodes = Array.isArray(query.internal_code) ? query.internal_code : [query.internal_code];
	let externalCodes = Array.isArray(query.external_code) ? query.external_code : [query.external_code];
	let ids = Array.isArray(query.id) ? query.id : [query.id];

	let or = []
	if (internalCodes.length > 0 && internalCodes[0] !== undefined) {
		internalCodes.forEach(internal => or.push(Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('internal_code')), 'LIKE', `%${internal.toLowerCase()}%`)));
	}
	if (externalCodes.length > 0 && externalCodes[0] !== undefined) {
		externalCodes.forEach(external => or.push(Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('external_code')), 'LIKE', `%${external.toLowerCase()}%`)));
	}
	if (ids.length > 0 && ids[0] !== undefined) {
		ids.forEach(id => or.push({ id: id }));
	}

	if (or.length === 0) return {}

	whereClause = {
		[Op.or]: or
	}

	return whereClause;
}

function catchError(res, error, message) {
    console.log(error)
    res.status(400).json({
        message,
        error
    })
}

module.exports = {
	PART_NOT_FOUND
}

module.exports = {
	getSparePartList,
	getSparePartByIdOrCode,
	createNewSparePart,
	deleteSparePart,
	updateSparePart,
	findSpareParts,
	findSparePartByIdOrCode
}