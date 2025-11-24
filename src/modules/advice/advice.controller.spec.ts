import { Test, TestingModule } from '@nestjs/testing';
import { AdviceController } from './advice.controller';
import { AdviceService } from './advice.service';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};
describe('AdviceController', () => {
  let controller: AdviceController;
  let adviceService: AdviceService;

  const mockAdviceService = {
    getAdviceForPlant: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdviceController],
      providers: [
        {
          provide: AdviceService,
          useValue: mockAdviceService,
        },
      ],
    }).overrideGuard(AuthGuard)  // ✅ Use actual AuthGuard class, not string
          .useValue(mockAuthGuard)
          .compile();

    controller = module.get<AdviceController>(AdviceController);
    adviceService = module.get<AdviceService>(AdviceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdvice', () => {
    const plantId = 1;

    it('should return comprehensive advice for a healthy plant', async () => {
      const expectedAdvice = {
        plant: {
          id: plantId,
          name: 'Test Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: {
            current: 24.5,
            average: 24.0,
            min: 20.0,
            max: 28.0,
          },
          moisture: {
            current: 65.0,
            average: 60.0,
            min: 50.0,
            max: 70.0,
          },
          light: {
            current: 28000,
            average: 25000,
            min: 15000,
            max: 35000,
          },
          readingsCount: 100,
          lastReading: new Date('2024-11-11T10:00:00Z'),
        },
        advice: [
          {
            type: 'success',
            category: 'temperature',
            message: 'Temperature is ideal (24.5°C).',
            priority: 3,
          },
          {
            type: 'success',
            category: 'moisture',
            message: 'Soil moisture is perfect (65.0%).',
            priority: 3,
          },
          {
            type: 'success',
            category: 'light',
            message: 'Light intensity is excellent (28000 lux).',
            priority: 3,
          },
        ],
        overallHealth: 'excellent',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(expectedAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(adviceService.getAdviceForPlant).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(adviceService.getAdviceForPlant).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedAdvice);
      expect(result).toHaveProperty('plant');
      expect(result).toHaveProperty('statistics');
      expect(result).toHaveProperty('advice');
      expect(result).toHaveProperty('overallHealth');
      expect(result).toHaveProperty('thresholds');
      expect(result.advice).toBeInstanceOf(Array);
      expect(result.overallHealth).toBe('excellent');
    });

    it('should return critical advice when soil is too dry', async () => {
      const criticalAdvice = {
        plant: {
          id: plantId,
          name: 'Dry Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 24.0, average: 24.0, min: 22.0, max: 26.0 },
          moisture: { current: 25.0, average: 60.0, min: 25.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'critical',
            category: 'moisture',
            message: 'Soil is too dry (25.0%). Water your plant immediately!',
            priority: 0,
            actionRequired: true,
          },
          {
            type: 'success',
            category: 'temperature',
            message: 'Temperature is ideal (24.0°C).',
            priority: 3,
          },
        ],
        overallHealth: 'critical',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(criticalAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.overallHealth).toBe('critical');
      expect(result.advice).toBeInstanceOf(Array);
      expect(result.advice.length).toBeGreaterThan(0);
      
      const criticalItems = result.advice.filter((a) => a.type === 'critical');
      expect(criticalItems.length).toBeGreaterThan(0);
      expect(criticalItems[0].actionRequired).toBe(true);
      expect(criticalItems[0].category).toBe('moisture');
    });

    it('should return warning advice when temperature is too cold', async () => {
      const coldAdvice = {
        plant: {
          id: plantId,
          name: 'Cold Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 15.0, average: 20.0, min: 15.0, max: 25.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 30,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'warning',
            category: 'temperature',
            message:
              'Temperature is too low (15.0°C). Move to warmer location or add heat protection.',
            priority: 1,
          },
          {
            type: 'success',
            category: 'moisture',
            message: 'Soil moisture is perfect (65.0%).',
            priority: 3,
          },
        ],
        overallHealth: 'needs attention',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(coldAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.overallHealth).toBe('needs attention');
      
      const warnings = result.advice.filter((a) => a.type === 'warning');
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].message).toContain('too low');
    });

    it('should return warning advice when temperature is too hot', async () => {
      const hotAdvice = {
        plant: {
          id: plantId,
          name: 'Hot Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 35.0, average: 28.0, min: 25.0, max: 35.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 40,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'warning',
            category: 'temperature',
            message:
              'Temperature is too high (35.0°C). Provide shade or move to cooler location.',
            priority: 1,
          },
        ],
        overallHealth: 'needs attention',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(hotAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      const warnings = result.advice.filter((a) => a.type === 'warning');
      expect(warnings.some((w) => w.message.includes('too high'))).toBe(true);
    });

    it('should detect sudden temperature drop (frost alert)', async () => {
      const frostAdvice = {
        plant: {
          id: plantId,
          name: 'Frost Risk Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 18.0, average: 24.0, min: 18.0, max: 28.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'critical',
            category: 'temperature',
            message:
              '⚠️ ALERT: Temperature dropped 7.0°C in last hour! Risk of cold damage. Consider bringing plant indoors or adding frost protection.',
            priority: 0,
            actionRequired: true,
          },
        ],
        overallHealth: 'critical',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(frostAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.overallHealth).toBe('critical');
      
      const criticalAdvice = result.advice.filter((a) => a.type === 'critical');
      expect(criticalAdvice.length).toBeGreaterThan(0);
      expect(criticalAdvice[0].message).toContain('Temperature dropped');
      expect(criticalAdvice[0].message).toContain('°C');
      expect(criticalAdvice[0].actionRequired).toBe(true);
    });

    it('should detect sudden temperature spike (heat stress)', async () => {
      const heatStressAdvice = {
        plant: {
          id: plantId,
          name: 'Heat Stress Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 32.0, average: 24.0, min: 20.0, max: 32.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'critical',
            category: 'temperature',
            message:
              '⚠️ ALERT: Temperature rose 8.0°C in last hour! Risk of heat stress. Provide shade or move to cooler location immediately.',
            priority: 0,
            actionRequired: true,
          },
        ],
        overallHealth: 'critical',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(heatStressAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      const criticalAdvice = result.advice.filter((a) => a.type === 'critical');
      expect(criticalAdvice[0].message).toContain('rose');
      expect(criticalAdvice[0].message).toContain('heat stress');
    });

    it('should detect sudden moisture drop', async () => {
      const moistureDropAdvice = {
        plant: {
          id: plantId,
          name: 'Leaky Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 24.0, average: 24.0, min: 22.0, max: 26.0 },
          moisture: { current: 40.0, average: 65.0, min: 40.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'warning',
            category: 'moisture',
            message:
              'Soil moisture dropped 25.0% in 2 hours. Check for drainage issues or leaks in irrigation system.',
            priority: 1,
            actionRequired: true,
          },
        ],
        overallHealth: 'needs attention',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(moistureDropAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      const warnings = result.advice.filter((a) => a.type === 'warning');
      expect(warnings.some((w) => w.message.includes('moisture dropped'))).toBe(
        true,
      );
    });

    it('should warn about low light intensity', async () => {
      const lowLightAdvice = {
        plant: {
          id: plantId,
          name: 'Dark Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 24.0, average: 24.0, min: 22.0, max: 26.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 8000, average: 10000, min: 5000, max: 15000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'warning',
            category: 'light',
            message:
              'Light intensity is too low (8000 lux). Move to brighter location or add grow lights.',
            priority: 1,
          },
        ],
        overallHealth: 'needs attention',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(lowLightAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      const warnings = result.advice.filter((a) => a.type === 'warning');
      expect(warnings.some((w) => w.category === 'light')).toBe(true);
    });

    it('should suggest care actions based on user history', async () => {
      const careAdvice = {
        plant: {
          id: plantId,
          name: 'Neglected Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 24.0, average: 24.0, min: 22.0, max: 26.0 },
          moisture: { current: 65.0, average: 65.0, min: 60.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 100,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'info',
            category: 'care',
            message:
              'Last fertilized 35 days ago. Consider fertilizing if plant is in active growth.',
            priority: 2,
          },
          {
            type: 'info',
            category: 'care',
            message:
              'Plant is 6 months old. Consider refreshing soil or repotting if growth has slowed.',
            priority: 3,
          },
        ],
        overallHealth: 'good',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(careAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      const careItems = result.advice.filter((a) => a.category === 'care');
      expect(careItems.length).toBeGreaterThan(0);
      expect(careItems.some((c) => c.message.includes('fertiliz'))).toBe(true);
    });

    it('should handle no sensor data scenario', async () => {
      const noDataAdvice = {
        plant: {
          id: plantId,
          name: 'New Tomato',
          species: 'Tomato',
        },
        advice: [
          {
            type: 'info',
            category: 'general',
            message:
              'No sensor data available yet. Waiting for first reading.',
            priority: 2,
          },
        ],
        overallHealth: 'unknown',
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(noDataAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.overallHealth).toBe('unknown');
      expect(result.advice).toHaveLength(1);
      expect(result.advice[0].message).toContain('No sensor data');
      expect(result).not.toHaveProperty('statistics');
    });

    it('should handle multiple simultaneous warnings', async () => {
      const multipleWarningsAdvice = {
        plant: {
          id: plantId,
          name: 'Struggling Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 16.0, average: 24.0, min: 16.0, max: 28.0 },
          moisture: { current: 35.0, average: 60.0, min: 35.0, max: 70.0 },
          light: { current: 8000, average: 25000, min: 8000, max: 35000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'warning',
            category: 'temperature',
            message:
              'Temperature is too low (16.0°C). Move to warmer location or add heat protection.',
            priority: 1,
          },
          {
            type: 'warning',
            category: 'moisture',
            message:
              'Soil moisture is acceptable (35.0%) but could be better. Ideal range: 60-80%.',
            priority: 2,
          },
          {
            type: 'warning',
            category: 'light',
            message:
              'Light intensity is too low (8000 lux). Move to brighter location or add grow lights.',
            priority: 1,
          },
        ],
        overallHealth: 'needs attention',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(
        multipleWarningsAdvice,
      );

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.advice.length).toBeGreaterThanOrEqual(3);
      expect(result.overallHealth).toBe('needs attention');
      
      const warnings = result.advice.filter((a) => a.type === 'warning');
      expect(warnings.length).toBe(3);
      
      const categories = warnings.map((w) => w.category);
      expect(categories).toContain('temperature');
      expect(categories).toContain('moisture');
      expect(categories).toContain('light');
    });

    it('should prioritize advice by priority level', async () => {
      const prioritizedAdvice = {
        plant: {
          id: plantId,
          name: 'Priority Test Tomato',
          species: 'Tomato',
        },
        statistics: {
          temperature: { current: 18.0, average: 24.0, min: 18.0, max: 28.0 },
          moisture: { current: 25.0, average: 60.0, min: 25.0, max: 70.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'critical',
            category: 'temperature',
            message: 'Critical temperature issue',
            priority: 0,
            actionRequired: true,
          },
          {
            type: 'warning',
            category: 'moisture',
            message: 'Warning moisture issue',
            priority: 1,
          },
          {
            type: 'info',
            category: 'care',
            message: 'Info care suggestion',
            priority: 2,
          },
          {
            type: 'success',
            category: 'light',
            message: 'Light is good',
            priority: 3,
          },
        ],
        overallHealth: 'critical',
        thresholds: {
          temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
          moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
          light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(prioritizedAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      // Verify advice is sorted by priority (0 = highest)
      expect(result.advice[0].priority).toBe(0);
      expect(result.advice[0].type).toBe('critical');
      
      for (let i = 0; i < result.advice.length - 1; i++) {
        expect(result.advice[i].priority).toBeLessThanOrEqual(
          result.advice[i + 1].priority,
        );
      }
    });

    it('should include plant-specific thresholds', async () => {
      const roseAdvice = {
        plant: {
          id: plantId,
          name: 'Test Rose',
          species: 'Rose',
        },
        statistics: {
          temperature: { current: 22.0, average: 22.0, min: 20.0, max: 24.0 },
          moisture: { current: 60.0, average: 60.0, min: 55.0, max: 65.0 },
          light: { current: 28000, average: 28000, min: 25000, max: 30000 },
          readingsCount: 50,
          lastReading: new Date(),
        },
        advice: [
          {
            type: 'success',
            category: 'temperature',
            message: 'Temperature is ideal (22.0°C).',
            priority: 3,
          },
        ],
        overallHealth: 'excellent',
        thresholds: {
          temperature: { min: 15, max: 29, ideal: { min: 18, max: 24 } },
          moisture: { min: 35, max: 75, ideal: { min: 50, max: 65 } },
          light: { min: 20000, max: 50000, ideal: { min: 25000, max: 35000 } },
        },
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(roseAdvice);

      const result = await controller.getAdvice(mockRequest, plantId);

      expect(result.thresholds).toBeDefined();
      expect(result.thresholds.temperature.min).toBe(15);
      expect(result.thresholds.temperature.max).toBe(29);
      // Different from Tomato thresholds
      expect(result.thresholds.temperature.ideal.min).toBe(18);
      expect(result.thresholds.temperature.ideal.max).toBe(24);
    });

    it('should handle service errors gracefully', async () => {
      mockAdviceService.getAdviceForPlant.mockRejectedValue(
        new Error('Plant not found'),
      );

      await expect(
        controller.getAdvice(mockRequest, plantId),
      ).rejects.toThrow('Plant not found');

      expect(adviceService.getAdviceForPlant).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
    });

    it('should pass correct user ID from request', async () => {
      const differentUser = {
        user: {
          id: 'user-456',
          email: 'different@example.com',
        },
      };

      const advice = {
        plant: { id: plantId, name: 'Test', species: 'Tomato' },
        advice: [],
        overallHealth: 'good',
        thresholds: {},
      };

      mockAdviceService.getAdviceForPlant.mockResolvedValue(advice);

      await controller.getAdvice(differentUser, plantId);

      expect(adviceService.getAdviceForPlant).toHaveBeenCalledWith(
        plantId,
        'user-456',
      );
    });
  });
});