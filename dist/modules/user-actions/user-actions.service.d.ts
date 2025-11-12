import { Repository } from 'typeorm';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { PlantsService } from '../plants/plants.service';
import { UserActionEntity } from './entities/user-action.entity';
export declare class UserActionsService {
    private userActionsRepository;
    private plantsService;
    constructor(userActionsRepository: Repository<UserActionEntity>, plantsService: PlantsService);
    create(plantId: string, userId: string, createUserActionDto: CreateUserActionDto): Promise<UserActionEntity>;
    getRecentActions(plantId: string, userId: string, days?: number): Promise<UserActionEntity[]>;
    getAllActionsForPlant(plantId: string, userId: string): Promise<UserActionEntity[]>;
    getActionsByType(plantId: string, userId: string, actionType: string): Promise<UserActionEntity[]>;
}
