import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentIncludes, IEquipmentRepository } from './IEquipmentRepository';
import { Equipment } from '../model/Equipment';
import { singleton } from 'tsyringe';
import { QueryOptions } from 'sequelize';

@singleton()
export class EquipmentRepository implements IEquipmentRepository {

	public async getAllEquipments(): Promise<EquipmentInstance[]> {
		return Equipment.findAll({
			include: EquipmentIncludes,
			order: [
				['code', 'DESC']
			]
		});
	}

	public async getEquipmentById(id: number): Promise<EquipmentInstance | null> {
		return Equipment.findByPk(
			id,
			{
				include: EquipmentIncludes,
			});
	}

	public async getEquipmentByCode(code: string, options?: QueryOptions): Promise<EquipmentInstance | null> {
		return Equipment.findOne({
			where: { code: code, },
			include: EquipmentIncludes,
			...options
		});
	}

	public async createEquipment(equipmentAttributes: EquipmentCreationAttributes): Promise<EquipmentInstance> {
		return Equipment.create(equipmentAttributes);
	}

	public async updateEquipment(id: number, equipmentAttributes: EquipmentCreationAttributes): Promise<[number]> {
		return Equipment.update(equipmentAttributes, {
			where: { id: id }
		});
	}

	public async saveEquipment(equipment: EquipmentInstance): Promise<EquipmentInstance> {
		return equipment.save();
	}
	public async reloadEquipment(equipment: EquipmentInstance, options?: QueryOptions): Promise<EquipmentInstance> {
		return equipment.reload({
			include: EquipmentIncludes,
			...options
		});
	}

	public async deleteEquipment(equipment: EquipmentInstance): Promise<void> {
		return equipment.destroy();
	}
	public async resetEquipmentPartialHours(equipment: EquipmentInstance): Promise<EquipmentInstance> {
		equipment.partial_hours = 0;
		return this.saveEquipment(equipment);
	}
}
