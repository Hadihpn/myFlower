import { Test, TestingModule } from '@nestjs/testing';
import { UserActionsController } from './user-actions.controller';
import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { ActionType } from './enum/user-actions.enum';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
const mockAuthGuard: CanActivate = {
  canActivate: () => true,
};
describe('UserActionsController', () => {
  let controller: UserActionsController;
  let userActionsService: UserActionsService;

  const mockUserActionsService = {
    create: jest.fn(),
    getAllActionsForPlant: jest.fn(),
    getRecentActions: jest.fn(),
    getActionsByType: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActionsController],
      providers: [
        {
          provide: UserActionsService,
          useValue: mockUserActionsService,
        },
      ],
    })
      .overrideGuard(AuthGuard) // ✅ Use actual AuthGuard class, not string
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserActionsController>(UserActionsController);
    userActionsService = module.get<UserActionsService>(UserActionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should record a user action', async () => {
      const plantId = 1;
      const createDto: CreateUserActionDto = {
        actionType: ActionType.WATERED,
        notes: 'Watered thoroughly',
        actionDate: '2024-11-11T09:00:00Z',
      };

      const expectedAction = {
        id: 1,
        ...createDto,
        plantId,
        userId: mockRequest.user.id,
        createdAt: new Date(),
      };

      mockUserActionsService.create.mockResolvedValue(expectedAction);

      const result = await controller.create(mockRequest, plantId, createDto);

      expect(userActionsService.create).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        createDto,
      );
      expect(result).toEqual(expectedAction);
    });

    it('should handle different action types', async () => {
      const plantId = 1;
      const actionTypes = [
        ActionType.WATERED,
        ActionType.FERTILIZED,
        ActionType.PRUNED,
        ActionType.SOIL_CHANGED,
      ];

      for (const actionType of actionTypes) {
        const createDto: CreateUserActionDto = {
          actionType,
          notes: `Test ${actionType}`,
          actionDate: new Date().toISOString(),
        };

        mockUserActionsService.create.mockResolvedValue({
          id: `action-${actionType}`,
          ...createDto,
        });

        await controller.create(mockRequest, plantId, createDto);

        expect(userActionsService.create).toHaveBeenCalled();
      }
    });
  });

  describe('getAllActions', () => {
    it('should return all actions for a plant', async () => {
      const plantId = 1;
      const expectedActions = [
        {
          id: 'action-1',
          actionType: ActionType.WATERED,
          notes: 'Watered',
          actionDate: new Date(),
        },
        {
          id: 'action-2',
          actionType: ActionType.FERTILIZED,
          notes: 'Fertilized',
          actionDate: new Date(),
        },
      ];

      mockUserActionsService.getAllActionsForPlant.mockResolvedValue(
        expectedActions,
      );

      const result = await controller.getAllActions(mockRequest, plantId);

      expect(userActionsService.getAllActionsForPlant).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
      );
      expect(result).toEqual(expectedActions);
    });
  });

  describe('getRecentActions', () => {
    it('should return recent actions with default days', async () => {
      const plantId = 1;
      const expectedActions = [
        {
          id: 1,
          actionType: ActionType.WATERED,
          actionDate: new Date(),
        },
      ];

      mockUserActionsService.getRecentActions.mockResolvedValue(
        expectedActions,
      );

      const result = await controller.getRecentActions(mockRequest, plantId);

      expect(userActionsService.getRecentActions).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        undefined,
      );
      expect(result).toEqual(expectedActions);
    });

    it('should respect custom days parameter', async () => {
      const plantId = 1;
      const days = 14;

      mockUserActionsService.getRecentActions.mockResolvedValue([]);

      await controller.getRecentActions(mockRequest, plantId, days);

      expect(userActionsService.getRecentActions).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        days,
      );
    });
  });

  describe('getActionsByType', () => {
    it('should return actions filtered by type', async () => {
      const plantId = 1;
      const actionType = ActionType.WATERED;
      const expectedActions = [
        {
          id: 1,
          actionType: ActionType.WATERED,
          notes: 'Watered today',
          actionDate: new Date(),
        },
        {
          id: 1,
          actionType: ActionType.WATERED,
          notes: 'Watered yesterday',
          actionDate: new Date(),
        },
      ];

      mockUserActionsService.getActionsByType.mockResolvedValue(
        expectedActions,
      );

      const result = await controller.getActionsByType(
        mockRequest,
        plantId,
        actionType,
      );

      expect(userActionsService.getActionsByType).toHaveBeenCalledWith(
        plantId,
        mockRequest.user.id,
        actionType,
      );
      expect(result).toEqual(expectedActions);
      expect(result.every((a) => a.actionType === ActionType.WATERED)).toBe(
        true,
      );
    });
  });
});
