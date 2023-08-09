import { Router } from 'express';

export interface IRoute {
	configureRoutes(router: Router): void;
}