import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserActionsService } from './user-actions.service';
import { PlantsService } from '../plants/plants.service';
import { UserActionEntity } from './entities/user-action.entity';
import { ActionType } from './enum/user-actions.enum';

describe('UserActionsService', () => {
  let service: UserActionsService;
  let repository: Repository<UserActionEntity>;
  let plantsService: PlantsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockPlantsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActionsService,
        {
          provide: getRepositoryToken(UserActionEntity),
          useValue: mockRepository,
        },
        {
          provide: PlantsService,
          useValue: mockPlantsService,
        },
      ],
    }).compile();

    service = module.get<UserActionsService>(UserActionsService);
    repository = module.get<Repository<UserActionEntity>>(
      getRepositoryToken(UserActionEntity),
    );
    plantsService = module.get<PlantsService>(PlantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create user action', async () => {
      const plantId = 1;
      const userId = 1;
      const createDto = {
        actionType: ActionType.WATERED,
        notes: 'Watered thoroughly',
        actionDate: '2024-11-11T10:00:00Z',
      };

      const savedAction = {
        id: 'action-123',
        ...createDto,
        plantId,
        userId,
      };

      mockPlantsService.findOne.mockResolvedValue({ id: plantId });
      mockRepository.create.mockReturnValue(savedAction);
      mockRepository.save.mockResolvedValue(savedAction);

      const result = await service.create(plantId, userId, createDto);

      expect(plantsService.findOne).toHaveBeenCalledWith(plantId, userId);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(savedAction);
    });
  });

  describe('getRecentActions', () => {
    it('should return recent actions within specified days', async () => {
      const plantId = 1;
      const userId = 1;
      const days = 7;

      const actions = [
        {
          id: 'action-1',
          actionType: ActionType.WATERED,
          actionDate: new Date(),
        },
        {
          id: 'action-2',
          actionType: ActionType.FERTILIZED,
          actionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ];

      mockRepository.find.mockResolvedValue(actions);

      const result = await service.getRecentActions(plantId, userId, days);

      expect(result).toEqual(actions);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            plantId,
            userId,
            actionDate: expect.any(Object),
          }),
          order: { actionDate: 'DESC' },
        }),
      );
    });
  });
});