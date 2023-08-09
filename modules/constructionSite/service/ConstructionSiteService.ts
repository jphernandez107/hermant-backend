import { ConstructionSite } from '../model/ConstructionSite';
import { ConstructionSiteMessages, IConstructionSiteService } from './IConstructionSiteService';
import { IConstructionSiteRepository } from '../repository/IConstructionSiteRepository';
import { ConstructionSiteCreationAttributes, ConstructionSiteInstance, ConstructionSiteUpdateAttributes } from '../model/IConstructionSite';

export class ConstructionSiteService implements IConstructionSiteService {
	private repository: IConstructionSiteRepository;

	constructor(repository: IConstructionSiteRepository) {
		this.repository = repository;
	}

	public async getAllSites(): Promise<ConstructionSiteInstance[]> {
		return await this.repository.getAllSites();
	}

	public async getSiteByIdOrCode(id: number | null, code: string | null): Promise<ConstructionSiteInstance | null> {
		let site: ConstructionSiteInstance | null = null;
		if (id) {
			site = await this.repository.getSiteById(id);
		} else if (code) {
			site = await this.repository.getSiteByCode(code);
		}
		return site;
	}

	public async createSite(siteAttributes: ConstructionSiteCreationAttributes): Promise<ConstructionSiteInstance> {
		return await this.repository.createSite(siteAttributes);
	}

	public async updateSite(id: number, siteAttributes: ConstructionSiteUpdateAttributes): Promise<[number, ConstructionSiteInstance[]]> {
		return await this.repository.updateSite(id, siteAttributes);
	}

	public async deleteSite(id: number | null, code: string | null): Promise<void> {
		const site = await this.getSiteByIdOrCode(id, code);
		if (!site) throw new Error(i18n.__(ConstructionSiteMessages.SITE_NOT_FOUND));
		return await this.repository.deleteSite(site);
	}

}
