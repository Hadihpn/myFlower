import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UpdateUserActionDto } from './dto/update-user-action.dto';
export declare class UserActionsService {
    create(createUserActionDto: CreateUserActionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserActionDto: UpdateUserActionDto): string;
    remove(id: number): string;
}
