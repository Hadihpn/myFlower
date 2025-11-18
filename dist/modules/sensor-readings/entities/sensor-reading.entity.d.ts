import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
export declare class SensorReadingEntity {
    id: number;
    temperature: number;
    moisture: number;
    light: number;
    timestamp: Date;
    createdAt: Date;
    plantId: number;
    plant: PlantEntity;
}
