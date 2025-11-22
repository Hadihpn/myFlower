import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SensorReadingsService } from './sensor-readings.service';
import { PlantsService } from '../plants/plants.service';
import { SensorReadingEntity } from './entities/sensor-reading.entity';

describe('SensorReadingsService', () => {
  let service: SensorReadingsService;
  let repository: Repository<SensorReadingEntity>;
  let plantsService: PlantsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPlantsService = {
    findByDeviceId: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorReadingsService,
        {
          provide: getRepositoryToken(SensorReadingEntity),
          useValue: mockRepository,
        },
        {
          provide: PlantsService,
          useValue: mockPlantsService,
        },
      ],
    }).compile();

    service = module.get<SensorReadingsService>(SensorReadingsService);
    repository = module.get<Repository<SensorReadingEntity>>(
      getRepositoryToken(SensorReadingEntity),
    );
    plantsService = module.get<PlantsService>(PlantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create sensor reading for valid device', async () => {
      const createDto = {
        deviceId: 'DEVICE_001',
        temperature: 24.5,
        moisture: 65.3,
        light: 28000,
        timestamp: '2024-11-11T10:00:00Z',
      };

      const plant = {
        id: 'plant-123',
        deviceId: 'DEVICE_001',
        name: 'Test Plant',
      };

      const savedReading = {
        id: 'reading-123',
        ...createDto,
        plantId: plant.id,
      };

      mockPlantsService.findByDeviceId.mockResolvedValue(plant);
      mockRepository.create.mockReturnValue(savedReading);
      mockRepository.save.mockResolvedValue(savedReading);

      const result = await service.create(createDto);

      expect(plantsService.findByDeviceId).toHaveBeenCalledWith('DEVICE_001');
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(savedReading);
    });

    it('should throw NotFoundException for invalid device', async () => {
      const createDto = {
        deviceId: 'INVALID_DEVICE',
        temperature: 24.5,
        moisture: 65.3,
        light: 28000,
        timestamp: '2024-11-11T10:00:00Z',
      };

      mockPlantsService.findByDeviceId.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getDailyAggregates', () => {
    it('should return daily aggregated data', async () => {
      const plantId = 1;
      const userId = 1;

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        userId,
      });

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            date: '2024-11-11',
            avgTemperature: '24.5',
            minTemperature: '20.0',
            maxTemperature: '28.0',
            avgMoisture: '65.0',
            minMoisture: '60.0',
            maxMoisture: '70.0',
            avgLight: '25000',
            minLight: '15000',
            maxLight: '35000',
            readingsCount: '48',
          },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getDailyAggregates(plantId, userId, 7);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('temperature');
      expect(result[0].temperature.avg).toBe(24.5);
      expect(result[0].readingsCount).toBe(48);
    });
  });

  describe('getLatestReading', () => {
    it('should return latest reading', async () => {
      const plantId = 1;
      const userId = 1;

      const latestReading = {
        id: 'reading-123',
        temperature: 24.5,
        moisture: 65,
        light: 28000,
        timestamp: new Date(),
      };

      mockPlantsService.findOne.mockResolvedValue({ id: plantId });
      mockRepository.findOne.mockResolvedValue(latestReading);

      const result = await service.getLatestReading(plantId, userId);

      expect(result).toEqual(latestReading);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { plantId },
        order: { timestamp: 'DESC' },
      });
    });

    it('should throw NotFoundException if no readings exist', async () => {
      const plantId = 1;
      const userId = 1;

      mockPlantsService.findOne.mockResolvedValue({ id: plantId });
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getLatestReading(plantId, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});