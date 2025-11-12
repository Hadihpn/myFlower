import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UpdateUserActionDto } from './dto/update-user-action.dto';
export declare class UserActionsController {
    private readonly userActionsService;
    constructor(userActionsService: UserActionsService);
    create(createUserActionDto: CreateUserActionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserActionDto: UpdateUserActionDto): string;
    remove(id: string): string;
}
