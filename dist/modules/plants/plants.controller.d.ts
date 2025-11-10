import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
export declare class PlantsController {
    private readonly plantsService;
    constructor(plantsService: PlantsService);
    create(createPlantDto: CreatePlantDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePlantDto: UpdatePlantDto): string;
    remove(id: string): string;
}
