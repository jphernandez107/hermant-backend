import { EquipmentInstance } from "../../equipment/model/IEquipment";
import { INextMaintenanceService, NUMBER_OF_MAINTENANCES_TO_CREATE } from "./INextMaintenanceService";
import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";
import { INextMaintenanceRepository } from "../repository/INextMaintenanceRepository";
import { EquipmentHourInstance } from "../../equipment/model/IEquipmentHour";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { IMaintenanceFrequencyRepository } from "../repository/IMaintenanceFrequecyRepository";
import { NextMaintenanceRepository } from "../repository/NextMaintenanceRepository";
import { MaintenanceFrequencyRepository } from "../repository/MaintenanceFrequencyRepository";
import { inject, injectable, singleton } from "tsyringe";
import { EquipmentHourRepository } from "../../equipment/repository/EquipmentHourRepository";
import { IEquipmentHourRepository } from "../../equipment/repository/IEquipmentHourRepository";
import i18n from 'i18n';

import "../../../utils/DateExtensions";
import { QueryOptions } from "sequelize";

@singleton()
@injectable()
export class NextMaintenanceService implements INextMaintenanceService {
	
	constructor(
		@inject(NextMaintenanceRepository) private nextMaintenanceRepository: INextMaintenanceRepository,
		@inject(MaintenanceFrequencyRepository) private maintenanceFrequencyRepository: IMaintenanceFrequencyRepository,
		@inject(EquipmentHourRepository) private equipmentHourRepository: IEquipmentHourRepository
	) {}

	public async updateNextMaintenancesForEquipments(equipments: EquipmentInstance[], options?: QueryOptions): Promise<NextMaintenanceInstance[]> {
		if (!equipments) return;
		let nextMaintenances: NextMaintenanceCreationAttributes[] = [];
		for (let equipment of equipments) {
			if (!equipment.lubrication_sheet_id) continue;
			await this.nextMaintenanceRepository.removeNextMaintenancesByEquipmentId(equipment.id, options);
			const equipmentHours = await this.equipmentHourRepository.getEquipmentHoursByEquipmentId(equipment.id, options);
			const averageUseHours = this.calculateAverageUseHours(equipmentHours);
			const maintenanceFrequencies = await this.maintenanceFrequencyRepository.getMaintenanceFrequenciesByLubricationSheetId(equipment.lubrication_sheet_id, options);
			if (maintenanceFrequencies.length === 0) continue;
			const nextMaintenancesForEquipment = this.calculateNextMaintenances(maintenanceFrequencies, equipment, averageUseHours);
			nextMaintenances.push(...nextMaintenancesForEquipment);
		}
		nextMaintenances = nextMaintenances.filter(nextMaintenance => nextMaintenance.maintenance_date.validateDate());
		return await this.nextMaintenanceRepository.createNextMaintenancesInBulk(nextMaintenances, options);
	}

	public async getAllNextMaintenances(): Promise<NextMaintenanceInstance[]> {
		return await this.nextMaintenanceRepository.getNextMaintenancesList();
	}

	private calculateAverageUseHours(equipmentHours: EquipmentHourInstance[]): number {
		if (equipmentHours.length === 0) return 12;
		const currentDate = new Date();
		const sixtyDaysAgo = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);
		const dailyHours = new Map<string, number>();

		for (let useHour of equipmentHours) {
			if (useHour.date < sixtyDaysAgo) continue;
			const dateStr = useHour.date.toISOString().slice(0, 10);
			dailyHours.set(
				dateStr,
				(dailyHours.get(dateStr) || 0) + useHour.hours_to_add
			);
		}

		const dailyHoursArray = Array.from(dailyHours.values());
		const totalHours = dailyHoursArray.reduce((total, hours) => total + hours, 0);
		const averageUseHours = Math.ceil(totalHours / dailyHoursArray.length) || 12;
		return averageUseHours;
	}

	private calculateNextMaintenances(maintenanceFrequencies: MaintenanceFrequencyInstance[], equipment: EquipmentInstance, averageUseHours: number): NextMaintenanceCreationAttributes[] {
		const frequencies = maintenanceFrequencies
			.map(frequency => frequency.frequency)
			.sort((a, b) => a - b);
		if (frequencies.length === 0) return [];
		const partial_hours = equipment.partial_hours || 0;
		const rotatedFrequencies = this.rotateFrequenciesToMatchPartialHours(frequencies, partial_hours);
		const maxFreq = rotatedFrequencies.max();
		
		const nextMaintenances: NextMaintenanceCreationAttributes[] = [];
		let nextMaint = 0;
		let accFreq = 0;
		while (
			nextMaintenances.length < NUMBER_OF_MAINTENANCES_TO_CREATE 
			&& rotatedFrequencies.length > 0
		) {
			const frequency: number = rotatedFrequencies[nextMaint++];
			if (accFreq < maxFreq) accFreq = frequency;
			else accFreq += frequency;
			const daysToNextMaintenance = this.calculateDaysToNextMaintenance(accFreq, partial_hours, averageUseHours);
			const frequencyId = maintenanceFrequencies.find(f => f.frequency === frequency).id;
			nextMaintenances.push(this.calculateNextMaintenance(equipment.id, daysToNextMaintenance, frequencyId));
			if (nextMaint === rotatedFrequencies.length) nextMaint = 0;
		}
		return nextMaintenances;
	}

	private calculateDaysToNextMaintenance(accFreq: number, partial_hours: number, averageUseHours: number): number {
		const hoursToNextMaintenance = accFreq - partial_hours;
		return Math.ceil(hoursToNextMaintenance / averageUseHours);
	}

	private calculateNextMaintenance(equipmentId: number, daysToNextMaintenance: number, frequencyId: number): NextMaintenanceCreationAttributes {
		const today = new Date();
		const nextMaintenanceDate = today.addDays(daysToNextMaintenance);
		return {
			equipment_id: equipmentId,
			maintenance_frequency_id: frequencyId,
			maintenance_date: nextMaintenanceDate,
		};
	}

	/**
	 * Rotates the frequencies array so that the first element is the first frequency that is greater than the partial hours
	 * @param frequencies // [1, 2, 3, 4, 5]
	 * @param partial_hours 
	 * @returns // [1, 2, 3, 4, 5] -> [3, 4, 5, 1, 2]
	 */
	private rotateFrequenciesToMatchPartialHours(frequencies: number[], partial_hours): number[] {
		const startIndex = frequencies.findIndex(f => f >= partial_hours) || 0;
		return frequencies 
			.slice(startIndex)
			.concat(frequencies.slice(0, startIndex));
	}

}