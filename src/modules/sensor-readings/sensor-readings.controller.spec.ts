import { Test, TestingModule } from '@nestjs/testing';
import { SensorReadingsController } from './sensor-readings.controller';
import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
// ✅ Mock the AuthGuard
const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};
describe('SensorReadingsController', () => {
  let controller: SensorReadingsController;
  let sensorReadingsService: SensorReadingsService;

  const mockSensorReadingsService = {
    create: jest.fn(),
    findByPlant: jest.fn(),
    getLatestReading: jest.fn(),
    getDailyAggregates: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorReadingsController],
      providers: [
        {
          provide: SensorReadingsService,
          useValue: mockSensorReadingsService,
        },
      ],
    }) .overrideGuard(AuthGuard)  // ✅ Use actual AuthGuard class, not string
          .useValue(mockAuthGuard)
          .compile();
    

    controller = module.get<SensorReadingsController>(
      SensorReadingsController,
    );
    sensorReadingsService = module.get<SensorReadingsService>(
      SensorReadingsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a sensor reading (no auth required)', async () => {
      const createDto: CreateSensorReadingDto = {
        deviceId: 'DEVICE_001',
        temperature: 24.5,
        moisture: 65.3,
        light: 28000,
        timestamp: '2024-11-11T10:00:00Z',
      };

      const expectedReading = {
        id: 1,
        ...createDto,
        plantId: 'plant-123',
        createdAt: new Date(),
      };

      mockSensorReadingsService.create.mockResolvedValue(expectedReading);

      const result = await controller.create(createDto);

      expect(sensorReadingsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedReading);
    });

    it('should handle invalid device ID', async () => {
      const createDto: CreateSensorReadingDto = {
        deviceId: 'INVALID_DEVICE',
        temperature: 24.5,
        moisture: 65.3,
        light: 28000,
        timestamp: '2024-11-11T10:00:00Z',
      };

      mockSensorReadingsService.create.mockRejectedValue(
        new Error('Device not found'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Device not found',
      );
    });
  });

  describe('findByPlant', () => {
    it('should return sensor readings for a plant', async () => {
      const plantId = 2;
      const expectedReadings = [
        {
          id: 1,
          temperature: 24.5,
          moisture: 65,
          light: 28000,
          timestamp: new Date(),
        },
        {
          id: 2,
          temperature: 25.0,
          moisture: 63,
          light: 29000,
          timestamp: new Date(),
        },
      ];

      mockSensorReadingsService.findByPlant.mockResolvedValue(
        expectedReadings,
      );

      const result = await controller.findByPlant(mockRequest, plantId);

      expect(sensorReadingsService.findByPlant).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        undefined,
      );
      expect(result).toEqual(expectedReadings);
    });

    it('should respect limit parameter', async () => {
      const plantId = 1;
      const limit = 50;

      mockSensorReadingsService.findByPlant.mockResolvedValue([]);

      await controller.findByPlant(mockRequest, plantId, limit);

      expect(sensorReadingsService.findByPlant).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        limit,
      );
    });
  });

  describe('getLatest', () => {
    it('should return latest sensor reading', async () => {
      const plantId = 1;
      const expectedReading = {
        id: 'reading-latest',
        temperature: 24.5,
        moisture: 65,
        light: 28000,
        timestamp: new Date(),
      };

      mockSensorReadingsService.getLatestReading.mockResolvedValue(
        expectedReading,
      );

      const result = await controller.getLatest(mockRequest, plantId);

      expect(sensorReadingsService.getLatestReading).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(result).toEqual(expectedReading);
    });
  });

  describe('getDailyAggregates', () => {
    it('should return daily aggregated data', async () => {
      const plantId = 1;
      const expectedAggregates = [
        {
          date: '2024-11-11',
          temperature: { avg: 24.5, min: 20.0, max: 28.0 },
          moisture: { avg: 65.0, min: 60.0, max: 70.0 },
          light: { avg: 28000, min: 15000, max: 35000 },
          readingsCount: 48,
        },
      ];

      mockSensorReadingsService.getDailyAggregates.mockResolvedValue(
        expectedAggregates,
      );

      const result = await controller.getDailyAggregates(mockRequest, plantId);

      expect(sensorReadingsService.getDailyAggregates).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        undefined,
      );
      expect(result).toEqual(expectedAggregates);
    });

    it('should respect days parameter', async () => {
      const plantId = 1;
      const days = 14;

      mockSensorReadingsService.getDailyAggregates.mockResolvedValue([]);

      await controller.getDailyAggregates(mockRequest, plantId, days);

      expect(sensorReadingsService.getDailyAggregates).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        days,
      );
    });
  });
});