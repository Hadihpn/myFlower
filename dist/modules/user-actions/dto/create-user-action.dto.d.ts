import { ActionType } from '../enum/user-actions.enum';
export declare class CreateUserActionDto {
    actionType: ActionType;
    notes?: string;
    actionDate: string;
}
