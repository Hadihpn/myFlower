import { Test, TestingModule } from '@nestjs/testing';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
// ✅ Mock the AuthGuard
const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};
describe('PlantsController', () => {
  let controller: PlantsController;
  let plantsService: PlantsService;

  const mockPlantsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getPlantStatistics: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      email: 'test@example.com',
    },
  };

 beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantsController],
      providers: [
        {
          provide: PlantsService,
          useValue: mockPlantsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)  // ✅ Use actual AuthGuard class, not string
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<PlantsController>(PlantsController);
    plantsService = module.get<PlantsService>(PlantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new plant', async () => {
           const createPlantDto = {
        name: 'My Tomato',
        species: 'Tomato',
        location: 'Garden',
        status: 'active',
        plantedDate: '2024-01-15',
        deviceId: 'DEVICE_001',
      };

      const expectedPlant = {
        id: 1,
        ...createPlantDto,
        userId: mockRequest.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPlantsService.create.mockResolvedValue(expectedPlant);

      const result = await controller.create(mockRequest, createPlantDto);

      expect(plantsService.create).toHaveBeenCalledWith(
        mockRequest.user.id,
        createPlantDto,
      );
      expect(result).toEqual(expectedPlant);
    });
  });

  describe('findAll', () => {
    it('should return all plants for user', async () => {
      const expectedPlants = [
        {
          id: 1,
          name: 'Tomato',
          species: 'Tomato',
          userId: mockRequest.user.id,
        },
        {
          id: 2,
          name: 'Rose',
          species: 'Rose',
          userId: mockRequest.user.id,
        },
      ];

      mockPlantsService.findAll.mockResolvedValue(expectedPlants);

      const result = await controller.findAll(mockRequest);

      expect(plantsService.findAll).toHaveBeenCalledWith(mockRequest.user.id);
      expect(result).toEqual(expectedPlants);
    });

    it('should return empty array when user has no plants', async () => {
      mockPlantsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a specific plant', async () => {
      const plantId = 1;
      const expectedPlant = {
        id: plantId,
        name: 'My Tomato',
        species: 'Tomato',
        userId: mockRequest.user.id,
      };

      mockPlantsService.findOne.mockResolvedValue(expectedPlant);

      const result = await controller.findOne(mockRequest, plantId);

      expect(plantsService.findOne).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(result).toEqual(expectedPlant);
    });
  });

  describe('getStatistics', () => {
    it('should return plant statistics', async () => {
      const plantId = 1;
      const expectedStats = {
        plant: {
          id: plantId,
          name: 'My Tomato',
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
          lastReading: new Date(),
        },
      };

      mockPlantsService.getPlantStatistics.mockResolvedValue(expectedStats);

      const result = await controller.getStatistics(mockRequest, plantId);

      expect(plantsService.getPlantStatistics).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(result).toEqual(expectedStats);
    });
  });

  describe('update', () => {
    it('should update a plant', async () => {
      const plantId = 1;
      const updatePlantDto: UpdatePlantDto = {
        name: 'Updated Tomato',
        location: 'New Garden',
      };

      const expectedPlant = {
        id: plantId,
        name: 'Updated Tomato',
        species: 'Tomato',
        location: 'New Garden',
        userId: mockRequest.user.id,
      };

      mockPlantsService.update.mockResolvedValue(expectedPlant);

      const result = await controller.update(
        mockRequest,
        plantId,
        updatePlantDto,
      );

      expect(plantsService.update).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        updatePlantDto,
      );
      expect(result).toEqual(expectedPlant);
    });
  });

  describe('remove', () => {
    it('should delete a plant', async () => {
      const plantId = 1;

      mockPlantsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockRequest, plantId);

      expect(plantsService.remove).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(result).toEqual({ message: 'Plant deleted successfully' });
    });
  });
});