import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
export declare class UserActionsController {
    private userActionsService;
    constructor(userActionsService: UserActionsService);
    create(req: any, plantId: number, createUserActionDto: CreateUserActionDto): Promise<import("./entities/user-action.entity").UserActionEntity>;
    getAllActions(req: any, plantId: number): Promise<import("./entities/user-action.entity").UserActionEntity[]>;
    getRecentActions(req: any, plantId: number, days?: number): Promise<import("./entities/user-action.entity").UserActionEntity[]>;
    getActionsByType(req: any, plantId: number, actionType: string): Promise<import("./entities/user-action.entity").UserActionEntity[]>;
}
