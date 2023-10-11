import { EquipmentHourCreationAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';
import { EquipmentHourIncludes, IEquipmentHourRepository } from './IEquipmentHourRepository';
import { EquipmentHour } from '../model/EquipmentHour';
import { singleton } from 'tsyringe';
import { QueryOptions } from 'sequelize';

@singleton()
export class EquipmentHourRepository implements IEquipmentHourRepository {
	public async getAllEquipmentHours(): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.findAll({
			include: EquipmentHourIncludes,
		});
	}
	public async createEquipmentHour(equipmentHour: EquipmentHourCreationAttributes): Promise<EquipmentHourInstance> {
		return EquipmentHour.create(equipmentHour);
	}
	public async createEquipmentHoursInBulk(equipmentHours: EquipmentHourCreationAttributes[]): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.bulkCreate(equipmentHours);
	}
	public async getEquipmentHoursByEquipmentId(equipmentId: number, options?: QueryOptions): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.findAll({ 
			where: { equipment_id: equipmentId },
			order: [
				['date', 'DESC']
			],
			include: EquipmentHourIncludes,
			...options
		});
	}
}