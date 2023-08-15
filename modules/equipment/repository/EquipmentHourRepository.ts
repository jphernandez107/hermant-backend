import { EquipmentHourCreationAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';
import { IEquipmentHourRepository } from './IEquipmentHourRepository';
import { EquipmentHour } from '../model/EquipmentHour';

export class EquipmentHourRepository implements IEquipmentHourRepository {
	public async getAllEquipmentHours(): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.findAll();
	}
	public async createEquipmentHour(equipmentHour: EquipmentHourCreationAttributes): Promise<EquipmentHourInstance> {
		return EquipmentHour.create(equipmentHour);
	}
	public async createEquipmentHoursInBulk(equipmentHours: EquipmentHourCreationAttributes[]): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.bulkCreate(equipmentHours);
	}
	public async getEquipmentHoursByEquipmentId(equipmentId: number): Promise<EquipmentHourInstance[]> {
		return EquipmentHour.findAll({ where: { equipment_id: equipmentId } });
	}
}