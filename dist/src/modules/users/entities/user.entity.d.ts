import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
export declare class UserEntity {
    id: number;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    plants: PlantEntity[];
}
