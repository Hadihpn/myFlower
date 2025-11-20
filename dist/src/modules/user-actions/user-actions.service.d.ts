import { Repository } from 'typeorm';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { PlantsService } from '../plants/plants.service';
import { UserActionEntity } from './entities/user-action.entity';
export declare class UserActionsService {
    private userActionsRepository;
    private plantsService;
    constructor(userActionsRepository: Repository<UserActionEntity>, plantsService: PlantsService);
    create(plantId: number, userId: number, createUserActionDto: CreateUserActionDto): Promise<UserActionEntity>;
    getRecentActions(plantId: number, userId: number, days?: number): Promise<UserActionEntity[]>;
    getAllActionsForPlant(plantId: number, userId: number): Promise<UserActionEntity[]>;
    getActionsByType(plantId: number, userId: number, actionType: string): Promise<UserActionEntity[]>;
}
