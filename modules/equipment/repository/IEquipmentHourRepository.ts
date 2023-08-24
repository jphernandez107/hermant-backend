import { QueryOptions } from 'sequelize';
import { EquipmentHourCreationAttributes, EquipmentHourInstance } from '../model/IEquipmentHour';

export interface IEquipmentHourRepository {
	getAllEquipmentHours(): Promise<EquipmentHourInstance[]>;
	createEquipmentHour(equipmentHour: EquipmentHourCreationAttributes): Promise<EquipmentHourInstance>;
	createEquipmentHoursInBulk(equipmentHours: EquipmentHourCreationAttributes[]): Promise<EquipmentHourInstance[]>;
	getEquipmentHoursByEquipmentId(equipmentId: number, options?: QueryOptions): Promise<EquipmentHourInstance[]>;
}