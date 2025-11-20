import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
export declare class SensorReadingsController {
    private sensorReadingsService;
    constructor(sensorReadingsService: SensorReadingsService);
    create(createSensorReadingDto: CreateSensorReadingDto): Promise<import("./entities/sensor-reading.entity").SensorReadingEntity>;
    findByPlant(req: any, plantId: number, limit?: number): Promise<import("./entities/sensor-reading.entity").SensorReadingEntity[]>;
    getLatest(req: any, plantId: number): Promise<import("./entities/sensor-reading.entity").SensorReadingEntity>;
    getDailyAggregates(req: any, plantId: number, days?: number): Promise<{
        date: any;
        temperature: {
            avg: number;
            min: number;
            max: number;
        };
        moisture: {
            avg: number;
            min: number;
            max: number;
        };
        light: {
            avg: number;
            min: number;
            max: number;
        };
        readingsCount: number;
    }[]>;
}
