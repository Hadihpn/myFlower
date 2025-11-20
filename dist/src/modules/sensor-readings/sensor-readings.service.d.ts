import { Repository } from 'typeorm';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { PlantsService } from '../plants/plants.service';
import { SensorReadingEntity } from './entities/sensor-reading.entity';
export declare class SensorReadingsService {
    private sensorReadingsRepository;
    private plantsService;
    constructor(sensorReadingsRepository: Repository<SensorReadingEntity>, plantsService: PlantsService);
    create(createSensorReadingDto: CreateSensorReadingDto): Promise<SensorReadingEntity>;
    findByPlant(plantId: number, userId: number, limit?: number): Promise<SensorReadingEntity[]>;
    findByDateRange(plantId: number, userId: number, startDate: Date, endDate: Date): Promise<SensorReadingEntity[]>;
    getDailyAggregates(plantId: number, userId: number, days?: number): Promise<{
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
    getLatestReading(plantId: number, userId: number): Promise<SensorReadingEntity>;
}
