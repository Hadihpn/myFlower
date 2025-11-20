import { SensorReadingEntity } from 'src/modules/sensor-readings/entities/sensor-reading.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
export declare class PlantEntity {
    id: number;
    name: string;
    species: string;
    description: string;
    location: string;
    plantedDate: Date;
    status: string;
    deviceId: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
    userId: number;
    sensorReadings: SensorReadingEntity[];
}
