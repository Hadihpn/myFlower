import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantEntity } from './entities/plant.entity';

describe('PlantsService', () => {
  let service: PlantsService;
  let repository: Repository<PlantEntity>;

  const mockPlantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantsService,
        {
          provide: getRepositoryToken(PlantEntity),
          useValue: mockPlantRepository,
        },
      ],
    }).compile();

    service = module.get<PlantsService>(PlantsService);
    repository = module.get<Repository<PlantEntity>>(
      getRepositoryToken(PlantEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new plant', async () => {
      const userId = 1;
      const createPlantDto = {
        name: 'My Tomato',
        species: 'Tomato',
        location: 'Garden',
        status: 'active',
        plantedDate: '2024-01-15',
        deviceId: 'DEVICE_001',
      };
const createdAt = new Date()
const updatedAt = new Date()
      const plant = {
        id: 1,
        ...createPlantDto,
        userId,
        createdAt,
        updatedAt,
        description: undefined,
      };

      mockPlantRepository.findOne.mockResolvedValue(null);
      mockPlantRepository.create.mockReturnValue(plant);
      mockPlantRepository.save.mockResolvedValue(plant);

      const result = await service.create(userId, createPlantDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { deviceId: createPlantDto.deviceId },
      });
       expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createPlantDto.name,
        species: createPlantDto.species,
        location: createPlantDto.location,
        status: createPlantDto.status,
        plantedDate: createPlantDto.plantedDate,
        deviceId: createPlantDto.deviceId,
        userId,
      }),
    );
        expect(repository.save).toHaveBeenCalledWith(plant);
        expect(result).toEqual(plant);
    });

    it('should throw ConflictException if device ID already exists', async () => {
      const userId = 1;
      const createPlantDto = {
        name: 'My Tomato',
        species: 'Tomato',
        location: 'Garden',
        status: 'active',
        plantedDate: '2024-01-15',
        deviceId: 'DEVICE_001',
      };

      mockPlantRepository.findOne.mockResolvedValue({ id: 'existing-plant' });

      await expect(service.create(userId, createPlantDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

    describe('findAll', () => {
      it('should return all plants for a user', async () => {
        const userId = 1;
        const plants = [
          { id: 'plant-1', name: 'Tomato', userId },
          { id: 'plant-2', name: 'Rose', userId },
        ];

        mockPlantRepository.find.mockResolvedValue(plants);

        const result = await service.findAll(userId);

        expect(repository.find).toHaveBeenCalledWith({
          where: { userId },
          order: { createdAt: 'DESC' },
        });
        expect(result).toEqual(plants);
      });
    });

    describe('findOne', () => {
      it('should return a plant if found', async () => {
        const plantId = 1;
        const userId = 1;
        const plant = { id: plantId, name: 'Tomato', userId };

        mockPlantRepository.findOne.mockResolvedValue(plant);

        const result = await service.findOne(plantId, userId);

        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id: plantId, userId },
          relations: ['sensorReadings'],
        });
        expect(result).toEqual(plant);
      });

      it('should throw NotFoundException if plant not found', async () => {
        const plantId = 200;
        const userId = 1;

        mockPlantRepository.findOne.mockResolvedValue(null);

        await expect(service.findOne(plantId, userId)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('remove', () => {
      it('should remove a plant', async () => {
        const plantId = 1;
        const userId = 1;
        const plant = { id: plantId, name: 'Tomato', userId };

        mockPlantRepository.findOne.mockResolvedValue(plant);
        mockPlantRepository.remove.mockResolvedValue(plant);

        await service.remove(plantId, userId);

        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.remove).toHaveBeenCalledWith(plant);
      });
    });
});
