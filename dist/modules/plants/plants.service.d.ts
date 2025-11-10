import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
export declare class PlantsService {
    create(createPlantDto: CreatePlantDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePlantDto: UpdatePlantDto): string;
    remove(id: number): string;
}
