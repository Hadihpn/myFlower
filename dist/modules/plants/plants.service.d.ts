import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantEntity } from './entities/plant.entity';
export declare class PlantsService {
    private plantsRepository;
    constructor(plantsRepository: Repository<PlantEntity>);
    create(userId: string, createPlantDto: CreatePlantDto): Promise<PlantEntity>;
    findAll(userId: string): Promise<PlantEntity[]>;
    findOne(id: string, userId: string): Promise<PlantEntity>;
    findByDeviceId(deviceId: string): Promise<PlantEntity | null>;
    update(id: string, userId: string, updatePlantDto: UpdatePlantDto): Promise<PlantEntity>;
    remove(id: string, userId: string): Promise<void>;
    getPlantStatistics(plantId: string, userId: string): Promise<{
        plant: {
            id: string;
            name: string;
            species: string;
        };
        statistics: null;
        message: string;
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
        message?: undefined;
    }>;
    private calculateAverage;
}
