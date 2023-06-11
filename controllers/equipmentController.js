const i18n = require("i18n");
const { findEquipmentByIdOrCode, findLubricationSheetById } = require("./commonController");
const maintenanceController = require("./maintenanceController");
const models = require("../ORM/models");
const { Utils } = require("../utils/utils");
const Equipment = models.equipment;
const EquipmentHour = models.equipment_hour;

const catchError = (res, error, status_code, message) => {
    Utils.errorResponse(res, error, message, status_code);
};

const getEquipmentMessage = (equipment) => {
    return `${equipment.designation} ${equipment.brand} ${equipment.model} ${equipment.code}`;
}

const getEquipmentsList = async (req, res) => {
	try {
		const equipments = await Equipment.findAll({
			include: Equipment.includes,
		});
		if (!equipments) 
            return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));
		
		equipments.forEach(processEquipments);
		return res.status(200).json(equipments);

	} catch (error) {
		catchError(res, error, 404, i18n.__("EQUIPMENT_NOT_FOUND"));
	}
};

const processEquipments = (equipment) => {
	const firstMaint = equipment.next_maintenances
		.map((maint) => new Date(maint.maintenance_date))
		.min();

	const next_maintenance = firstMaint
		? new Date(firstMaint)
		: undefined;
	
	equipment.dataValues.next_maintenance = next_maintenance
		? next_maintenance.toLocaleDateString()
		: undefined;
};

const handleEquipment = async (req, res, error_message, action) => {
	try {
		const equipment = await findEquipmentByIdOrCode(req.query);
		if (!equipment) 
            return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));

		const response = await action(req, equipment);

		return res.status(200).json(response);

	} catch (error) {
		catchError(res, error, 400, error_message);
	}
};

const getEquipmentByIdOrCode = (req, res) => handleEquipment(req, res, i18n.__("EQUIPMENT_NOT_FOUND"), (_, equipment) => {
    processEquipments(equipment);
    return equipment;
});

const postNewEquipment = async (req, res) => {
	try {
		const equipment = await Equipment.create(req.body);
		if (!equipment) 
            return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));

		return res.status(200).json({
			message: getEquipmentMessage(equipment, i18n.__("EQUIPMENT_CREATED")),
			equipment: equipment,
		});
		
	} catch (error) {
		catchError(res, error, 500, i18n.__("ERROR_CREATING_EQUIPMENT"));
	}
};

const deleteEquipment = (req, res) => handleEquipment(req, res, i18n.__("ERROR_DELETING_EQUIPMENT"), async (_, equipment) => {
	await equipment.destroy();
	return {
		message: getEquipmentMessage(equipment, i18n.__("EQUIPMENT_DELETED")),
		equipment: equipment,
	};
});

const updateEquipment = (req, res) => handleEquipment(req, res, i18n.__("ERROR_UPDATING_EQUIPMENT"), async (req, equipment) => {
	await equipment.update(req.body);
	return {
		message: getEquipmentMessage(equipment, i18n.__("EQUIPMENT_UPDATED")),
		equipment: equipment,
	};
});

const addUseHours = async (req, res) => {
	try {
		const body = req.body;
		let equipmentHourBody = processEquipmentHourBody(body);
		const equipmentQuery = {
			id: req.query.id,
			code: req.query.code,
		};

		if (equipmentHourBody.hours_to_add < 0)
			return catchError(res, null, 400, i18n.__("CANNOT_ADD_NEGATIVE_HOURS"));

		const equipment = await findEquipmentByIdOrCode(equipmentQuery);

		if (!equipment) 
            return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));

		const site = equipment.construction_sites[0];
		equipmentHourBody = appendAdditionalEquipmentData(equipmentHourBody, equipment, site);

		const equipment_hour = await EquipmentHour.create(equipmentHourBody);

		if (!equipment_hour)
			return catchError(res, null, 500, i18n.__("ERROR_CREATING_EQUIPMENT_HOUR"));

		const total = equipment.total_hours + equipment_hour.hours_to_add;
		const partial = equipment.partial_hours + equipment_hour.hours_to_add;

		const equipmentUpdated = await equipment.update({
			total_hours: total,
			partial_hours: partial,
		});

		if (!equipmentUpdated)
			return catchError(res, null, 500, ERROR_UPDATING_EQUIPMENT);

		if (equipmentUpdated.lubrication_sheet_id)
			await maintenanceController.updateNextMaintenancesForEquipment(equipmentUpdated);

        const message = i18n.__("EQUIPMENT_HOUR_ADDED", {
            equipmentHours: `${equipment_hour.hours_to_add}`,
            equipment: getEquipmentMessage(equipment)
        });
		return res.status(200).json({
			message: message,
			site: site,
			equipment: equipmentUpdated,
			use_hour: equipment_hour,
		});
		
	} catch (error) {
		catchError(res, error, 500, i18n.__("ERROR_ADDING_HOURS"));
	}
};

const processEquipmentHourBody = (body) => ({
	hours_to_add: parseInt(body.hours_to_add),
	date: body.date,
	observations: body.observations,
	user_id: body.user_id || 0,
});

const appendAdditionalEquipmentData = (equipmentHourBody, equipment, site) => {
	equipmentHourBody.equipment_id = equipment.id;
	equipmentHourBody.construction_site_id = site ? site.id : null;
	equipmentHourBody.total_hours = equipment.total_hours;
	equipmentHourBody.partial_hours = equipment.partial_hours;

	return equipmentHourBody;
};

const addLubricationSheetToEquipment = async (req, res) => {
	try {
		const body = req.body;
		const equipmentQuery = {
			id: body.equipment_id,
			code: body.equipment_code,
		};

		const equipment = await findEquipmentByIdOrCode(equipmentQuery);

		if (!equipment) 
            return catchError(res, null, 404, i18n.__("EQUIPMENT_NOT_FOUND"));

		const lubrication_sheet = await findLubricationSheetById({ id: body.lubrication_sheet_id });

		if (!lubrication_sheet) 
            return catchError(res, null, 404, i18n.__("LUBRICATION_SHEET_NOT_FOUND"));

		lubrication_sheet.addEquipments(equipment);

        const message = i18n.__("EQUIPMENT_ADDED_TO_LUBRICATION_SHEET", {
            equipment: getEquipmentMessage(equipment)
        });
		return res.status(200).json({
			message: message,
			equipment: equipment,
		});
		
	} catch (error) {
		catchError(res, error, 500, i18n.__("ERROR_ADDING_LUBRICATION_SHEET"));
	}
};

module.exports = {
	getEquipmentsList,
	getEquipmentByIdOrCode,
	postNewEquipment,
	deleteEquipment,
	updateEquipment,
	addUseHours,
	addLubricationSheetToEquipment,
};
