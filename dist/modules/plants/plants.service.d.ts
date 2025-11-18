import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantEntity } from './entities/plant.entity';
export declare class PlantsService {
    private plantsRepository;
    constructor(plantsRepository: Repository<PlantEntity>);
    create(userId: number, createPlantDto: CreatePlantDto): Promise<PlantEntity>;
    findAll(userId: number): Promise<PlantEntity[]>;
    findOne(id: number, userId: number): Promise<PlantEntity>;
    findByDeviceId(deviceId: string): Promise<PlantEntity | null>;
    update(id: number, userId: number, updatePlantDto: UpdatePlantDto): Promise<PlantEntity>;
    remove(id: number, userId: number): Promise<void>;
    getPlantStatistics(plantId: number, userId: number): Promise<{
        plant: {
            id: number;
            name: string;
            species: string;
        };
        statistics: null;
        message: string;
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
        message?: undefined;
    }>;
    private calculateAverage;
}
