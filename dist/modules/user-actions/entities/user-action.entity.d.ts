import { PlantEntity } from '../../plants/entities/plant.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ActionType } from '../enum/user-actions.enum';
export declare class UserActionEntity {
    id: number;
    actionType: ActionType;
    notes: string;
    actionDate: Date;
    createdAt: Date;
    plant: PlantEntity;
    plantId: number;
    user: UserEntity;
    userId: number;
}
