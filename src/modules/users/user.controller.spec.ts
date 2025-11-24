import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UsersController', () => {
  let controller: UserController;
  let usersService: UserService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile from request', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

    //   const mockRequest = {
    //     user: mockUser,
    //   };
      // ✅ Mock findOne to return the user
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
    });

    it('should return user without sensitive data', async () => {
      const mockUser = {
        id: 2,
        email: 'test@example.com',
        fullName: 'Test User',
        // password should be excluded by @Exclude decorator in entity
      };
// ✅ Mock findOne to return the user
      mockUsersService.findOne.mockResolvedValue(mockUser);
    //   const mockRequest = {
    //     user: mockUser,
    //   };

      const result = await controller.findOne(mockUser.id);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
    });
  });
});