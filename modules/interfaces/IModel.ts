import { Model, Sequelize } from "sequelize";


export interface IModel {
	associate?(models: any): void;
	initModel?(sequelize: Sequelize): void;
}