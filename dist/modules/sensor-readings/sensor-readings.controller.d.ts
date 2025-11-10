import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { UpdateSensorReadingDto } from './dto/update-sensor-reading.dto';
export declare class SensorReadingsController {
    private readonly sensorReadingsService;
    constructor(sensorReadingsService: SensorReadingsService);
    create(createSensorReadingDto: CreateSensorReadingDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSensorReadingDto: UpdateSensorReadingDto): string;
    remove(id: string): string;
}
