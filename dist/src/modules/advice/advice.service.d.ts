import { PlantsService } from '../plants/plants.service';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { UserActionsService } from '../user-actions/user-actions.service';
export declare class AdviceService {
    private sensorReadingsService;
    private plantsService;
    private userActionsService;
    private readonly plantThresholds;
    constructor(sensorReadingsService: SensorReadingsService, plantsService: PlantsService, userActionsService: UserActionsService);
    getAdviceForPlant(plantId: number, userId: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string;
        };
        advice: {
            type: string;
            category: string;
            message: string;
            priority: number;
        }[];
        overallHealth: string;
        statistics?: undefined;
        thresholds?: undefined;
    } | {
        plant: {
            id: number;
            name: string;
            species: string;
        };
        statistics: {
            temperature: {
                current: number;
                average: number;
                min: number;
                max: number;
            };
            moisture: {
                current: number;
                average: number;
                min: number;
                max: number;
            };
            light: {
                current: number;
                average: number;
                min: number;
                max: number;
            };
            readingsCount: number;
            lastReading: Date;
        };
        advice: AdviceItem[];
        overallHealth: string;
        thresholds: any;
    }>;
    private detectSuddenChanges;
    private analyzeCurrentConditions;
    private analyzeCareHistory;
    private analyzeTrends;
    private calculateAverage;
}
