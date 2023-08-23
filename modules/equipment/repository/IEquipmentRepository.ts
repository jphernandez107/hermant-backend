import { QueryOptions } from 'sequelize';
import { EquipmentCreationAttributes, EquipmentInstance } from '../model/IEquipment';
export interface IEquipmentRepository {
	getAllEquipments(): Promise<EquipmentInstance[]>;
	getEquipmentById(id: number): Promise<EquipmentInstance | null>;
	getEquipmentByCode(code: string, options?: QueryOptions): Promise<EquipmentInstance | null>;
	createEquipment(equipmentAttributes: EquipmentCreationAttributes): Promise<EquipmentInstance>;
	updateEquipment(id: number, equipmentAttributes: EquipmentCreationAttributes): Promise<[number]>;
	saveEquipment(equipment: EquipmentInstance): Promise<EquipmentInstance>;
	deleteEquipment(equipment: EquipmentInstance): Promise<void>;
	resetEquipmentPartialHours(equipment: EquipmentInstance): Promise<EquipmentInstance>;
}

export const EquipmentIncludes = [
	{
		association: 'construction_site'
	},
	{
		association: 'lubrication_sheet',
		include: [
			{
				association: 'lubrication_sheet_spare_parts',
				include: [
					{
						association: 'spare_part'
					},
					{
						association: 'frequencies'
					}
				]
			}
		]
	},
	{
		association: 'maintenances',
		include: [
			{
				association: 'maintenance_frequency'
			}
		]
	},
	{
		association: 'next_maintenances',
		include: [
			{
				association: 'maintenance_frequency'
			}
		]
	},
];
