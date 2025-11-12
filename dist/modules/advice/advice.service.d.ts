import { PlantsService } from '../plants/plants.service';
export interface AdviceItem {
    type: 'warning' | 'info' | 'success';
    category: 'temperature' | 'moisture' | 'light' | 'general';
    message: string;
    priority: number;
}
export declare class AdviceService {
    private plantsService;
    private readonly plantThresholds;
    constructor(plantsService: PlantsService);
    getAdviceForPlant(plantId: string, userId: string): Promise<{
        plant: {
            id: string;
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
            id: string;
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
}
