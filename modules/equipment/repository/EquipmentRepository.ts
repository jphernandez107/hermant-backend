import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
import { EquipmentIncludes, IEquipmentRepository } from './IEquipmentRepository';
import { Equipment } from '../model/Equipment';

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

	public async getEquipmentByCode(code: string): Promise<EquipmentInstance | null> {
		return Equipment.findOne({
			where: { code: code, },
			include: EquipmentIncludes
		});
	}

	public async createEquipment(equipmentAttributes: EquipmentCreationAttributes): Promise<EquipmentInstance> {
		return Equipment.create(equipmentAttributes);
	}

	public async updateEquipment(id: number, equipmentAttributes: EquipmentCreationAttributes): Promise<[number, EquipmentInstance[]]> {
		return Equipment.update(equipmentAttributes, {
			where: { id: id },
			returning: true
		});
	}

	public async saveEquipment(equipment: EquipmentInstance): Promise<EquipmentInstance> {
		return equipment.save();
	}

	public async deleteEquipment(equipment: EquipmentInstance): Promise<void> {
		return equipment.destroy();
	}
}
