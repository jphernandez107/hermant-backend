import { EquipmentInstance } from "modules/equipment/model/IEquipment";
import { INextMaintenanceService, NUMBER_OF_MAINTENANCES_TO_CREATE } from "./INextMaintenanceService";
import { NextMaintenanceCreationAttributes, NextMaintenanceInstance } from "../model/INextMaintenance";
import { INextMaintenanceRepository } from "../repository/INextMaintenanceRepository";
import { IEquipmentService } from "modules/equipment/service/IEquipmentService";
import { EquipmentHourInstance } from "modules/equipment/model/IEquipmentHour";
import { MaintenanceFrequencyInstance } from "../model/IMaintenanceFrequency";
import { IMaintenanceFrequencyRepository } from "../repository/IMaintenanceFrequecyRepository";

export class NextMaintenanceService implements INextMaintenanceService {
	private nextMaintenanceRepository: INextMaintenanceRepository;
	private maintenanceFrequencyRepository: IMaintenanceFrequencyRepository;
	private equipmentService: IEquipmentService;

	constructor(nextMaintenanceRepository: INextMaintenanceRepository, maintenanceFrequencyRepository: IMaintenanceFrequencyRepository , equipmentService: IEquipmentService) {
		this.nextMaintenanceRepository = nextMaintenanceRepository;
		this.maintenanceFrequencyRepository = maintenanceFrequencyRepository;
		this.equipmentService = equipmentService;
	}


	public async updateNextMaintenancesForEquipments(equipments: EquipmentInstance[]): Promise<NextMaintenanceInstance[]> {
		let nextMaintenances: NextMaintenanceCreationAttributes[] = [];
		for (let equipment of equipments) {
			if (!equipment.lubrication_sheet_id) continue;
			await this.nextMaintenanceRepository.removeNextMaintenancesByEquipmentId(equipment.id);
			const equipmentHours = await this.equipmentService.getEquipmentHoursByEquipmentId(equipment.id);
			const averageUseHours = this.calculateAverageUseHours(equipmentHours);
			const maintenanceFrequencies = await this.maintenanceFrequencyRepository.getMaintenanceFrequenciesByLubricationSheetId(equipment.lubrication_sheet_id);
			if (maintenanceFrequencies.length === 0) continue;
			const nextMaintenancesForEquipment = this.calculateNextMaintenances(maintenanceFrequencies, equipment, averageUseHours);
			nextMaintenances.push(...nextMaintenancesForEquipment);
		}
		nextMaintenances = nextMaintenances.filter(nextMaintenance => nextMaintenance.maintenance_date.validateDate());
		return await this.nextMaintenanceRepository.createNextMaintenancesInBulk(nextMaintenances);
	}

	public async getAllNextMaintenances(): Promise<NextMaintenanceInstance[]> {
		return await this.nextMaintenanceRepository.getNextMaintenancesList();
	}

	private calculateAverageUseHours(equipmentHours: EquipmentHourInstance[]): number {
		if (equipmentHours.length === 0) return 12;
		const currentDate = new Date();
		const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
		const dailyHours = new Map<string, number>();

		for (let useHour of equipmentHours) {
			if (useHour.date < thirtyDaysAgo) continue;
			const dateStr = useHour.date.toISOString().slice(0, 10);
			dailyHours.set(
				dateStr,
				(dailyHours.get(dateStr) || 0) + useHour.hours_to_add
			);
		}

		const dailyHoursArray = Array.from(dailyHours.values());
		const totalHours = dailyHoursArray.reduce((total, hours) => total + hours, 0);
		return Math.ceil(totalHours / dailyHoursArray.length);
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