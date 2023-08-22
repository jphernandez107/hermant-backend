import { singleton } from 'tsyringe';
import { ConstructionSite } from '../model/ConstructionSite';
import { ConstructionSiteCreationAttributes, ConstructionSiteInstance, ConstructionSiteUpdateAttributes } from '../model/IConstructionSite';
import { ConstructionSiteIncludes, IConstructionSiteRepository } from './IConstructionSiteRepository';

@singleton()
export class ConstructionSiteRepository implements IConstructionSiteRepository {
  
	public async getAllSites(): Promise<ConstructionSite[]> {
		return await ConstructionSite.findAll({
			include: ConstructionSiteIncludes,
		});
	}

	public async getSiteById(id: number): Promise<ConstructionSite | null> {
		return ConstructionSite.findByPk(id, {
			include: ConstructionSiteIncludes,
		});
	}

	public async getSiteByCode(code: string): Promise<ConstructionSite | null> {
		return ConstructionSite.findOne({
			where: { code: code, },
			include: ConstructionSiteIncludes,
		});
	}

	public async createSite(siteAttributes: ConstructionSiteCreationAttributes): Promise<ConstructionSite> {
		return await ConstructionSite.create(siteAttributes);
	}

	public async updateSite(id: number, siteAttributes: ConstructionSiteUpdateAttributes): Promise<[number]> {
		return ConstructionSite.update(siteAttributes, {
			where: { id: id }
		});
	}

	public async saveSite(site: ConstructionSiteInstance): Promise<ConstructionSiteInstance> {
		return site.save();
	}

	public async deleteSite(site: ConstructionSiteInstance): Promise<void> {
		return site.destroy();
	}
}
