import { ConstructionSiteCreationAttributes, ConstructionSiteInstance, ConstructionSiteUpdateAttributes } from '../model/IConstructionSite';

export interface IConstructionSiteRepository {
	getAllSites(): Promise<ConstructionSiteInstance[]>;
	getSiteById(id: number): Promise<ConstructionSiteInstance | null>;
	getSiteByCode(code: string): Promise<ConstructionSiteInstance | null>;
	createSite(siteAttributes: ConstructionSiteCreationAttributes): Promise<ConstructionSiteInstance>;
	deleteSite(site: ConstructionSiteInstance): Promise<void>;
	updateSite(id: number, siteAttributes: ConstructionSiteUpdateAttributes): Promise<[number]>;
	saveSite(site: ConstructionSiteInstance): Promise<ConstructionSiteInstance>;
	deleteSite(site: ConstructionSiteInstance): Promise<void>;
}

export const ConstructionSiteIncludes = [
	{
		association: "equipments",
		include: [
		{
			association: 'next_maintenances',
			include: [
			{
				association: 'maintenance_frequency'
			}
			]
		}
		]
	},
];