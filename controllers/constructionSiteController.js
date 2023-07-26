const models = require('../ORM/models')
const Site = models.construction_site;
const { findSiteByIdOrCode } = require("./commonController");

const SITE_NOT_FOUND = `Site not found.`;
const ERROR_CREATING_SITE = `Error creating site.`;
const SITE_CREATED = `Site created successfully.`;
const SITE_DELETED = `Site deleted successfully.`;
const SITE_UPDATED = `Site updated successfully.`;
const ERROR_DELETING_SITE = `Error deleting site.`;
const ERROR_UPDATING_SITE = `Error updating site.`;

const getSitesList = async (req, res) => {
	try {
		const sites = await Site.findAll({
			include: Site.includes,
			where: whereClause(req.query),
		});
		if (!sites) return res.status(404).send(SITE_NOT_FOUND);
		return res.status(200).json(sites);
	} catch (error) {
		catchError(res, error, "Error retrieving sites.");
	}
};

const getSiteByIdOrCode = async (req, res) => {
	try {
		const site = await findSiteByIdOrCode(req.query);
		if (!site) return res.status(404).send(SITE_NOT_FOUND);
		return res.status(200).json(site);
	} catch (error) {
		catchError(res, error, SITE_NOT_FOUND);
	}
};

const postNewSite = async (req, res) => {
	let body = req.body;
	try {
		const site = await Site.create(body);
		if (!site) return res.status(404).send(ERROR_CREATING_SITE);
		return res.status(200).json({
			message: SITE_CREATED,
			site: site,
		});
	} catch (error) {
		catchError(res, error, ERROR_CREATING_SITE);
	}
};

const deleteSite = async (req, res) => {
	try {
		const site = await findSiteByIdOrCode(req.query);
		if (!site) return res.status(404).send(ERROR_CREATING_SITE);
		await site.destroy();
		return res.status(200).json({
			message: SITE_DELETED,
			site: site,
		});
	} catch (error) {
		catchError(res, error, ERROR_DELETING_SITE);
	}
};

const updateSite = async (req, res) => {
	let body = req.body;
	try {
		const site = await findSiteByIdOrCode(req.query);
		if (!site) return res.status(404).send(ERROR_CREATING_SITE);
		await site.update(body);
		return res.status(200).json({
			message: SITE_UPDATED,
			site: site,
		});
	} catch (error) {
		catchError(res, error, ERROR_UPDATING_SITE);
	}
};

function whereClause(query) {
	return undefined;
}

function whereIdOrCode(query) {
	console.log(query);
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

function catchError(res, error, message) {
	console.log(error);
	res.status(400).json({
		message,
		error,
	});
}

module.exports = {
	getSitesList,
	getSiteByIdOrCode,
	postNewSite,
	deleteSite,
	updateSite,
	findSiteByIdOrCode,
};
