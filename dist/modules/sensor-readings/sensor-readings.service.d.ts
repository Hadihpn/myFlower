import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { UpdateSensorReadingDto } from './dto/update-sensor-reading.dto';
export declare class SensorReadingsService {
    create(createSensorReadingDto: CreateSensorReadingDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSensorReadingDto: UpdateSensorReadingDto): string;
    remove(id: number): string;
}
