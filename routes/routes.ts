import { Express, Router } from "express";
import { EquipmentRoute } from "../modules/equipment/route/EquipmentRoute";
import { UserRoute } from "../modules/user/route/UserRoute";
import { ConstructionSiteRoute } from "../modules/constructionSite/route/ConstructionSiteRoute";
import { LubricationSheetRoute } from "../modules/lubricationSheet/route/LubricationSheetRoute";
import { SparePartRoute } from "../modules/sparePart/route/SparePartRoute";
import { MaintenanceRoute } from "../modules/maintenance/route/MaintenanceRoute";

export const routes = (): any[] => {
	return [
		{
			url: "/equipment",
			router: new EquipmentRoute().configureRoutes()
		},
		{
			url: "/site",
			router: new ConstructionSiteRoute().configureRoutes()
		},
		{
			url: "/lubricationsheet",
			router: new LubricationSheetRoute().configureRoutes()
		},
		{
			url: "/part",
			router: new SparePartRoute().configureRoutes()
		},
		{
			url: "/maintenance",
			router: new MaintenanceRoute().configureRoutes()
		},
		{
			url: "/user",
			router: new UserRoute().configureRoutes()
		},
	]
};