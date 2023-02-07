const models = require('../ORM/models')
const Site = models.construction_site;
const equipmentController = require('./equipmentController')

const includes = ['equipments']

const SITE_NOT_FOUND = `Site not found.`
const ERROR_CREATING_SITE = `Error creating site.`
const SITE_CREATED = `Site created successfully.`
const SITE_DELETED = `Site deleted successfully.`
const SITE_UPDATED = `Site updated successfully.`
const ERROR_DELETING_SITE = `Error deleting site.`
const ERROR_UPDATING_SITE = `Error updating site.`
const ERROR_ADDING_EQUIPMENT_TO_SITE = `Error adding equipment to site.`
const ERROR_REMOVING_EQUIPMENT_FROM_SITE = `Error removing equipment from site.`

const getSitesList = async (req, res) => {
    try {
        const sites = await Site.findAll({
                include: includes,
                where: whereClause(req.query)
            })
        if (!sites) return res.status(404).send(SITE_NOT_FOUND)
        return res.status(200).json(sites)
    } catch(error) {
        catchError(res, error, "Error retrieving sites.")
    }
}

const getSiteByIdOrCode = async (req, res) => {
    try {
        const site = await findSiteByIdOrCode(req.query)
        if (!site) return res.status(404).send(SITE_NOT_FOUND)
        return res.status(200).json(site)
    } catch (error) {
        catchError(res, error, SITE_NOT_FOUND)
    }
}

/**
 * Finds a single construction site record based on the query parameters.
 * 
 * @param {Object} query 
 * @returns {Equipment} site - A single construction site record from database
 */
 async function findSiteByIdOrCode(query) {
    const site = await Site.findOne ({
        include: includes,
        where: whereIdOrCode(query)
    })
    return site
}

const postNewSite = async (req, res) => {
    let body = req.body
    try {
        const site = await Site.create(body)
        if (!site) return res.status(404).send(ERROR_CREATING_SITE)
        return res.status(200).json({
            message: SITE_CREATED,
            site: site
        })
    } catch (error) {
        catchError(res, error, ERROR_CREATING_SITE)
    }
}

const deleteSite = async (req, res) => {
    try {
        const site = await findSiteByIdOrCode(req.query)
        if (!site) return res.status(404).send(ERROR_CREATING_SITE)
        await site.destroy()
        return res.status(200).json({
            message: SITE_DELETED,
            site: site
        })
    } catch (error) {
        catchError(res, error, ERROR_DELETING_SITE)
    }
}

const updateSite = async (req, res) => {
    let body = req.body
    try {
        const site = await findSiteByIdOrCode(req.query)
        if (!site) return res.status(404).send(ERROR_CREATING_SITE)
        await site.update(body)
        return res.status(200).json({
            message: SITE_UPDATED,
            site: site
        })
    } catch (error) {
        catchError(res, error, ERROR_UPDATING_SITE)
    }
}

const addEquipmentToSite = async (req, res) => {
    let body = req.body
    let siteQuery = {
        id: body.site_id,
        code: body.site_code
    }
    let equipmentQuery = {
        id: body.equipment_id,
        code: body.equipment_code
    }
    console.log(equipmentQuery)
    try {
        const equipment = await equipmentController.findEquipmentByIdOrCode(equipmentQuery)
        if (!equipment) return res.status(404).send(equipmentController.EQUIPMENT_NOT_FOUND)

        const site = await findSiteByIdOrCode(siteQuery)
        if (!site) return res.status(404).send(SITE_NOT_FOUND)
        
        await site.addEquipments(equipment)
        return res.status(200).json({
            message: `Equipment ${equipment.code} added to site ${site.code} succsesfully.`,
            site: site,
            equipment: equipment
        })
    } catch (error) {
        catchError(res, error, ERROR_ADDING_EQUIPMENT_TO_SITE)
    }
}

const removeEquipmentFromSite = async (req, res) => {
    let body = req.body
    let siteQuery = {
        id: body.site_id,
        code: body.site_code
    }
    let equipmentQuery = {
        id: body.equipment_id,
        code: body.equipment_code
    }
    try {
        const equipment = await equipmentController.findEquipmentByIdOrCode(equipmentQuery)
        if (!equipment) return res.status(404).send(equipmentController.EQUIPMENT_NOT_FOUND)

        const site = await findSiteByIdOrCode(siteQuery)
        if (!site) return res.status(404).send(SITE_NOT_FOUND)
        
        await site.removeEquipments(equipment)
        return res.status(200).json({
            message: `Equipment ${equipment.code} removed from site ${site.code} succsesfully.`,
            site: site,
            equipment: equipment
        })
    } catch (error) {
        catchError(res, error, ERROR_REMOVING_EQUIPMENT_FROM_SITE)
    }
}

function whereClause(query) {
    return undefined
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

function catchError(res, error, message) {
    console.log(error)
    res.status(400).json({
        message,
        error
    })
}

module.exports = {
    getSitesList,
    getSiteByIdOrCode,
    postNewSite,
    deleteSite,
    updateSite,
    addEquipmentToSite,
    removeEquipmentFromSite,
    findSiteByIdOrCode
}