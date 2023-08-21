import { Model, Sequelize } from 'sequelize';
import config from './config/config';
import { ConstructionSite } from '../modules/constructionSite/model/ConstructionSite'; // Import your models here
import { Equipment } from '../modules/equipment/model/Equipment';
import { EquipmentHour } from '../modules/equipment/model/EquipmentHour';
import { User } from '../modules/user/model/User';
import { LubricationSheet } from '../modules/lubricationSheet/model/LubricationSheet';
import { LubricationSheetSparePart } from '../modules/lubricationSheet/model/LubricationSheetSparePart';
import { MaintenanceFrequencyLubricationSheetSparePart } from '../modules/lubricationSheet/model/MaintenanceFrequencyLubricationSheetSparePart';
import { Maintenance } from '../modules/maintenance/model/Maintenance';
import { MaintenanceFrequency } from '../modules/maintenance/model/MaintenanceFrequency';
import { MaintenanceSparePart } from '../modules/maintenance/model/MaintenanceSparePart';
import { NextMaintenance } from '../modules/maintenance/model/NextMaintenance';
import { SparePart } from '../modules/sparePart/model/SparePart';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = dbConfig.use_env_variable
	? new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig)
	: new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const modelsArray: any = [
	ConstructionSite,
	Equipment,
	EquipmentHour,
	LubricationSheet,
	LubricationSheetSparePart,
	MaintenanceFrequencyLubricationSheetSparePart,
	Maintenance,
	MaintenanceFrequency,
	MaintenanceSparePart,
	NextMaintenance,
	SparePart,
	User,
];

const models = {};

// Initialize models
modelsArray.forEach((model: { initModel: (arg0: Sequelize) => any; }) => {
	let mod: any = model.initModel(sequelize);
	models[mod.name] = mod;
});

// Run associations
modelsArray.forEach((model: { associate: (arg0: {}) => any; }) => model.associate(models));

export { sequelize, models }; // Export for use elsewhere in your application
