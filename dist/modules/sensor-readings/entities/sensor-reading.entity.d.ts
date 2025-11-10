import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
export declare class SensorReadingEntity {
    id: string;
    temperature: number;
    moisture: number;
    light: number;
    timestamp: Date;
    createdAt: Date;
    plantId: string;
    plant: PlantEntity;
}
