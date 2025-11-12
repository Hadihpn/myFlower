import { Repository } from 'typeorm';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { PlantsService } from '../plants/plants.service';
import { SensorReadingEntity } from './entities/sensor-reading.entity';
export declare class SensorReadingsService {
    private sensorReadingsRepository;
    private plantsService;
    constructor(sensorReadingsRepository: Repository<SensorReadingEntity>, plantsService: PlantsService);
    create(createSensorReadingDto: CreateSensorReadingDto): Promise<SensorReadingEntity>;
    findByPlant(plantId: string, userId: string, limit?: number): Promise<SensorReadingEntity[]>;
    findByDateRange(plantId: string, userId: string, startDate: Date, endDate: Date): Promise<SensorReadingEntity[]>;
    getDailyAggregates(plantId: string, userId: string, days?: number): Promise<{
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
    getLatestReading(plantId: string, userId: string): Promise<SensorReadingEntity>;
}
