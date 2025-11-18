import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
export declare class PlantsController {
    private plantsService;
    constructor(plantsService: PlantsService);
    create(req: any, createPlantDto: CreatePlantDto): Promise<import("./entities/plant.entity").PlantEntity>;
    findAll(req: any): Promise<import("./entities/plant.entity").PlantEntity[]>;
    findOne(req: any, id: number): Promise<import("./entities/plant.entity").PlantEntity>;
    getStatistics(req: any, id: number): Promise<{
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
    update(req: any, id: number, updatePlantDto: UpdatePlantDto): Promise<import("./entities/plant.entity").PlantEntity>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
}
