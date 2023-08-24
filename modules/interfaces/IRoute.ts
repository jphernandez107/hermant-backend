import { Router } from 'express';

export interface IRoute {
	configureRoutes(): Router;
}