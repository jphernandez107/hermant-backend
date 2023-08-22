import { ConstructionSiteCreationAttributes, ConstructionSiteInstance, ConstructionSiteUpdateAttributes } from '../model/IConstructionSite';

export interface IConstructionSiteService {
	getAllSites(): Promise<ConstructionSiteInstance[]>;
	getSiteByIdOrCode(siteId: number | null, siteCode: string | null): Promise<ConstructionSiteInstance | null>;
	createSite(siteAttributes: ConstructionSiteCreationAttributes): Promise<ConstructionSiteInstance>;
	updateSite(id: number, siteAttributes: ConstructionSiteUpdateAttributes): Promise<[number, ConstructionSiteInstance]>;
	deleteSite(id: number | null, code: string | null): Promise<void>;
}

export const ConstructionSiteMessages = {
	SITE_NOT_FOUND: "SITE_NOT_FOUND",
	ERROR_CREATING_SITE: "ERROR_CREATING_SITE",
	SITE_CREATED: "SITE_CREATED",
	SITE_DELETED: "SITE_DELETED",
	ERROR_DELETING_SITE: "ERROR_DELETING_SITE",
	ERROR_UPDATING_SITE: "ERROR_UPDATING_SITE",
	SITE_UPDATED: "SITE_UPDATED",
}
