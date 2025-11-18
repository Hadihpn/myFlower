import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { PlantsService } from '../plants/plants.service';
import { SensorReadingEntity } from './entities/sensor-reading.entity';

@Injectable()
export class SensorReadingsService {
  constructor(
    @InjectRepository(SensorReadingEntity)
    private sensorReadingsRepository: Repository<SensorReadingEntity>,
    private plantsService: PlantsService,
  ) {}

  async create(
    createSensorReadingDto: CreateSensorReadingDto,
  ): Promise<SensorReadingEntity> {
    // Find plant by device ID
    const plant = await this.plantsService.findByDeviceId(
      createSensorReadingDto.deviceId,
    );

    if (!plant) {
      throw new NotFoundException(
        `Plant with device ID ${createSensorReadingDto.deviceId} not found`,
      );
    }

    const sensorReading = this.sensorReadingsRepository.create({
      temperature: createSensorReadingDto.temperature,
      moisture: createSensorReadingDto.moisture,
      light: createSensorReadingDto.light,
      timestamp: new Date(createSensorReadingDto.timestamp),
      plantId: plant.id,
    });

    return await this.sensorReadingsRepository.save(sensorReading);
  }

  async findByPlant(
    plantId: number,
    userId: number,
    limit: number = 100,
  ): Promise<SensorReadingEntity[]> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    return await this.sensorReadingsRepository.find({
      where: { plantId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findByDateRange(
    plantId: number,
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<SensorReadingEntity[]> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    return await this.sensorReadingsRepository.find({
      where: {
        plantId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
    });
  }

  async getDailyAggregates(plantId: number, userId: number, days: number = 7) {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const readings = await this.sensorReadingsRepository
      .createQueryBuilder('reading')
      .select('DATE(reading.timestamp)', 'date')
      .addSelect('AVG(reading.temperature)', 'avgTemperature')
      .addSelect('AVG(reading.moisture)', 'avgMoisture')
      .addSelect('AVG(reading.light)', 'avgLight')
      .addSelect('MIN(reading.temperature)', 'minTemperature')
      .addSelect('MAX(reading.temperature)', 'maxTemperature')
      .addSelect('MIN(reading.moisture)', 'minMoisture')
      .addSelect('MAX(reading.moisture)', 'maxMoisture')
      .addSelect('MIN(reading.light)', 'minLight')
      .addSelect('MAX(reading.light)', 'maxLight')
      .addSelect('COUNT(*)', 'readingsCount')
      .where('reading.plantId = :plantId', { plantId })
      .andWhere('reading.timestamp >= :startDate', { startDate })
      .groupBy('DATE(reading.timestamp)')
      .orderBy('date', 'DESC')
      .getRawMany();

    return readings.map((reading) => ({
      date: reading.date,
      temperature: {
        avg: parseFloat(reading.avgTemperature),
        min: parseFloat(reading.minTemperature),
        max: parseFloat(reading.maxTemperature),
      },
      moisture: {
        avg: parseFloat(reading.avgMoisture),
        min: parseFloat(reading.minMoisture),
        max: parseFloat(reading.maxMoisture),
      },
      light: {
        avg: parseFloat(reading.avgLight),
        min: parseFloat(reading.minLight),
        max: parseFloat(reading.maxLight),
      },
      readingsCount: parseInt(reading.readingsCount),
    }));
  }

  async getLatestReading(
    plantId: number,
    userId: number,
  ): Promise<SensorReadingEntity> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    const reading = await this.sensorReadingsRepository.findOne({
      where: { plantId },
      order: { timestamp: 'DESC' },
    });

    if (!reading) {
      throw new NotFoundException('No sensor readings found for this plant');
    }

    return reading;
  }
}