import { Test, TestingModule } from '@nestjs/testing';
import { AdviceService } from './advice.service';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { PlantsService } from '../plants/plants.service';
import { UserActionsService } from '../user-actions/user-actions.service';

describe('AdviceService', () => {
  let service: AdviceService;
  let sensorReadingsService: SensorReadingsService;
  let plantsService: PlantsService;
  let userActionsService: UserActionsService;

  const mockSensorReadingsService = {
    findByPlant: jest.fn(),
  };

  const mockPlantsService = {
    findOne: jest.fn(),
    getPlantStatistics: jest.fn(),
  };

  const mockUserActionsService = {
    getRecentActions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviceService,
        {
          provide: SensorReadingsService,
          useValue: mockSensorReadingsService,
        },
        {
          provide: PlantsService,
          useValue: mockPlantsService,
        },
        {
          provide: UserActionsService,
          useValue: mockUserActionsService,
        },
      ],
    }).compile();

    service = module.get<AdviceService>(AdviceService);
    sensorReadingsService = module.get<SensorReadingsService>(
      SensorReadingsService,
    );
    plantsService = module.get<PlantsService>(PlantsService);
    userActionsService = module.get<UserActionsService>(UserActionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdviceForPlant', () => {
    it('should return advice when no data available', async () => {
      const plantId = 1;
      const userId = 1;

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        name: 'Test Plant',
        species: 'Tomato',
      });

      mockPlantsService.getPlantStatistics.mockResolvedValue({
        plant: { id: plantId, name: 'Test Plant', species: 'Tomato' },
        statistics: null,
      });

      const result = await service.getAdviceForPlant(plantId, userId);

      expect(result.advice).toHaveLength(1);
      expect(result.advice[0].message).toContain('No sensor data');
      expect(result.overallHealth).toBe('unknown');
    });

    it('should detect critical moisture level', async () => {
      const plantId = 1;
      const userId = 1;

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        name: 'Test Tomato',
        species: 'Tomato',
        plantedDate: new Date('2024-01-01'),
      });

      mockPlantsService.getPlantStatistics.mockResolvedValue({
        plant: { id: plantId, name: 'Test Tomato', species: 'Tomato' },
        statistics: {
          temperature: { current: 24, average: 24, min: 20, max: 28 },
          moisture: { current: 25, average: 50, min: 25, max: 70 }, // CRITICAL!
          light: { current: 25000, average: 25000, min: 15000, max: 35000 },
          readingsCount: 100,
          lastReading: new Date(),
        },
      });

      mockSensorReadingsService.findByPlant.mockResolvedValue([
        {
          temperature: 24,
          moisture: 25,
          light: 25000,
          timestamp: new Date(),
        },
      ]);

      mockUserActionsService.getRecentActions.mockResolvedValue([]);

      const result = await service.getAdviceForPlant(plantId, userId);
      const criticalAdvice = result.advice.filter((a) => a.type === 'critical');
      expect(criticalAdvice.length).toBeGreaterThan(0);
      expect(criticalAdvice[0].message).toContain('too dry');
      expect(criticalAdvice[0].actionRequired).toBe(true);
      expect(result.overallHealth).toBe('critical');
    });

    it('should detect sudden temperature drop', async () => {
      const plantId = 1;
      const userId = 1;

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        name: 'Test Plant',
        species: 'Tomato',
        plantedDate: new Date('2024-01-01'),
      });

      mockPlantsService.getPlantStatistics.mockResolvedValue({
        plant: { id: plantId, name: 'Test Plant', species: 'Tomato' },
        statistics: {
          temperature: { current: 18, average: 24, min: 18, max: 28 },
          moisture: { current: 60, average: 60, min: 50, max: 70 },
          light: { current: 25000, average: 25000, min: 15000, max: 35000 },
          readingsCount: 50,
          lastReading: now,
        },
      });

      // Simulate readings showing temperature drop
      mockSensorReadingsService.findByPlant.mockResolvedValue([
        { temperature: 18, moisture: 60, light: 25000, timestamp: now }, // Current
        {
          temperature: 19,
          moisture: 60,
          light: 25000,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000),
        },
        { temperature: 24, moisture: 60, light: 25000, timestamp: oneHourAgo }, // 1 hour ago
      ]);

      mockUserActionsService.getRecentActions.mockResolvedValue([]);

      const result = await service.getAdviceForPlant(plantId, userId);

      const criticalAdvice = result.advice.filter((a) => a.type === 'critical');
      expect(criticalAdvice.length).toBeGreaterThan(0);
      expect(criticalAdvice[0].message).toContain('Temperature dropped');
      expect(criticalAdvice[0].message).toContain('°C');
    });

    it('should suggest fertilization when not done recently', async () => {
      const plantId = 1;
      const userId = 1;

      const now = new Date();
      const longAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        name: 'Test Plant',
        species: 'Tomato',
        plantedDate: longAgo,
      });

      mockPlantsService.getPlantStatistics.mockResolvedValue({
        plant: { id: plantId, name: 'Test Plant', species: 'Tomato' },
        statistics: {
          temperature: { current: 24, average: 24, min: 20, max: 28 },
          moisture: { current: 60, average: 60, min: 50, max: 70 },
          light: { current: 25000, average: 25000, min: 15000, max: 35000 },
          readingsCount: 100,
          lastReading: now,
        },
      });

      mockSensorReadingsService.findByPlant.mockResolvedValue([
        { temperature: 24, moisture: 60, light: 25000, timestamp: now },
      ]);

      // Last fertilized 35 days ago
      mockUserActionsService.getRecentActions.mockResolvedValue([
        {
          actionType: 'fertilized',
          actionDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
          notes: 'Applied fertilizer',
        },
      ]);

      const result = await service.getAdviceForPlant(plantId, userId);

      const fertilizeAdvice = result.advice.find((a) =>
        a.message.toLowerCase().includes('fertiliz'),
      );
      expect(fertilizeAdvice).toBeDefined();
      expect(fertilizeAdvice).toBeDefined();
      if (fertilizeAdvice) {
        expect(fertilizeAdvice.category).toBe('care');
      }
    });

    it('should show excellent health for ideal conditions', async () => {
      const plantId = 1;
      const userId = 1;

      mockPlantsService.findOne.mockResolvedValue({
        id: plantId,
        name: 'Test Tomato',
        species: 'Tomato',
        plantedDate: new Date('2024-01-01'),
      });

      mockPlantsService.getPlantStatistics.mockResolvedValue({
        plant: { id: plantId, name: 'Test Tomato', species: 'Tomato' },
        statistics: {
          temperature: { current: 24, average: 24, min: 22, max: 26 }, // Ideal
          moisture: { current: 70, average: 70, min: 65, max: 75 }, // Ideal
          light: { current: 30000, average: 30000, min: 25000, max: 35000 }, // Ideal
          readingsCount: 100,
          lastReading: new Date(),
        },
      });

      mockSensorReadingsService.findByPlant.mockResolvedValue([
        { temperature: 24, moisture: 70, light: 30000, timestamp: new Date() },
      ]);

      mockUserActionsService.getRecentActions.mockResolvedValue([
        {
          actionType: 'watered',
          actionDate: new Date(),
          notes: 'Watered today',
        },
      ]);

      const result = await service.getAdviceForPlant(plantId, userId);

      const successAdvice = result.advice.filter((a) => a.type === 'success');
      expect(successAdvice.length).toBeGreaterThanOrEqual(2);
      expect(result.overallHealth).toBe('excellent');
    });
  });
});
