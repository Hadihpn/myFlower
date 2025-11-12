import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { UpdateSensorReadingDto } from './dto/update-sensor-reading.dto';
export declare class SensorReadingsController {
    private readonly sensorReadingsService;
    constructor(sensorReadingsService: SensorReadingsService);
    create(createSensorReadingDto: CreateSensorReadingDto): Promise<import("./entities/sensor-reading.entity").SensorReadingEntity>;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateSensorReadingDto: UpdateSensorReadingDto): any;
    remove(id: string): any;
}
