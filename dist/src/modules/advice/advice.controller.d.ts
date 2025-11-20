import { AdviceService } from './advice.service';
export declare class AdviceController {
    private adviceService;
    constructor(adviceService: AdviceService);
    getAdvice(req: any, plantId: number): Promise<{
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
}
