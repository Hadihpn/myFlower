import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ActionType } from '../enum/user-actions.enum';
export declare class UserActionEntity {
    id: string;
    actionType: ActionType;
    notes: string;
    actionDate: Date;
    createdAt: Date;
    plant: PlantEntity;
    plantId: string;
    user: UserEntity;
    userId: string;
}
