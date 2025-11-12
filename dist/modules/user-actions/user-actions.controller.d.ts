import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UpdateUserActionDto } from './dto/update-user-action.dto';
export declare class UserActionsController {
    private readonly userActionsService;
    constructor(userActionsService: UserActionsService);
    create(createUserActionDto: CreateUserActionDto): Promise<import("./entities/user-action.entity").UserActionEntity>;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateUserActionDto: UpdateUserActionDto): any;
    remove(id: string): any;
}
