import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantEntity } from './entities/plant.entity';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(PlantEntity)
    private plantsRepository: Repository<PlantEntity>,
  ) {}

  async create(
    userId: string,
    createPlantDto: CreatePlantDto,
  ): Promise<PlantEntity> {
    const { name, description, location, plantedDate, status, deviceId } =
      createPlantDto;
    // Check if device ID already exists
    const existingPlant = await this.plantsRepository.findOne({
      where: { deviceId: createPlantDto.deviceId },
    });

    if (existingPlant) {
      throw new ConflictException('Device ID already registered');
    }

    const plant = this.plantsRepository.create({
      name,
      description,
      location,
      plantedDate,
      status,
      deviceId,
      createdAt: new Date(),
      updatedAt: new Date(),

      userId,
    });

    return await this.plantsRepository.save(plant);
  }

  async findAll(userId: string): Promise<PlantEntity[]> {
    return await this.plantsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<PlantEntity> {
    const plant = await this.plantsRepository.findOne({
      where: { id, userId },
      relations: ['sensorReadings'],
    });

    if (!plant) {
      throw new NotFoundException('Plant not found');
    }

    return plant;
  }

  async findByDeviceId(deviceId: string): Promise<PlantEntity | null> {
    return await this.plantsRepository.findOne({
      where: { deviceId },
    });
  }

  async update(
    id: string,
    userId: string,
    updatePlantDto: UpdatePlantDto,
  ): Promise<PlantEntity> {
    const plant = await this.findOne(id, userId);

    // If updating deviceId, check it's not already used
    if (updatePlantDto.deviceId && updatePlantDto.deviceId !== plant.deviceId) {
      const existingPlant = await this.plantsRepository.findOne({
        where: { deviceId: updatePlantDto.deviceId },
      });

      if (existingPlant) {
        throw new ConflictException('Device ID already registered');
      }
    }

    Object.assign(plant, updatePlantDto);
    return await this.plantsRepository.save(plant);
  }

  async remove(id: string, userId: string): Promise<void> {
    const plant = await this.findOne(id, userId);
    await this.plantsRepository.remove(plant);
  }

  async getPlantStatistics(plantId: string, userId: string) {
    const plant = await this.findOne(plantId, userId);

    // Get readings from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const readings = await this.plantsRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.sensorReadings', 'reading')
      .where('plant.id = :plantId', { plantId })
      .andWhere('reading.timestamp >= :date', { date: sevenDaysAgo })
      .orderBy('reading.timestamp', 'DESC')
      .getOne();

    if (!readings || !readings.sensorReadings.length) {
      return {
        plant: {
          id: plant.id,
          name: plant.name,
          species: plant.species,
        },
        statistics: null,
        message: 'No sensor data available',
      };
    }

    const sensorReadings = readings.sensorReadings;

    // Calculate statistics
    const temperatures = sensorReadings.map((r) => Number(r.temperature));
    const moistures = sensorReadings.map((r) => Number(r.moisture));
    const lights = sensorReadings.map((r) => Number(r.light));

    const statistics = {
      temperature: {
        current: temperatures[0],
        average: this.calculateAverage(temperatures),
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
      },
      moisture: {
        current: moistures[0],
        average: this.calculateAverage(moistures),
        min: Math.min(...moistures),
        max: Math.max(...moistures),
      },
      light: {
        current: lights[0],
        average: this.calculateAverage(lights),
        min: Math.min(...lights),
        max: Math.max(...lights),
      },
      readingsCount: sensorReadings.length,
      lastReading: sensorReadings[0].timestamp,
    };

    return {
      plant: {
        id: plant.id,
        name: plant.name,
        species: plant.species,
      },
      statistics,
    };
  }

  private calculateAverage(numbers: number[]): number {
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 100) / 100;
  }
}
