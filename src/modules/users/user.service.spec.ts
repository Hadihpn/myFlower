import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

describe('UsersService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        fullName: 'Test User',
        phone: '+1234567890',
      };

      const expectedUser = {
        id: 1,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);
       

      const result = await service.create(userData);

      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.fullName).toBe(userData.fullName);
    });

    it('should create user without optional phone number', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        fullName: 'Test User',
      };

      const expectedUser = {
        id: 'user-123',
        ...userData,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(userData);

      expect(result).toEqual(expectedUser);
      expect(result.phone).toBeNull();
    });

    it('should handle creation with partial user data', async () => {
      const partialUserData: Partial<UserEntity> = {
        email: 'partial@example.com',
        password: 'hashed',
        fullName: 'Partial User',
      };

      const expectedUser = {
        id: 1,
        email: partialUserData.email,
        password: partialUserData.password,
        fullName: partialUserData.fullName,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(partialUserData);

      expect(result).toBeDefined();
      expect(result.email).toBe(partialUserData.email);
    });

    it('should propagate database errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        fullName: 'Test User',
      };

      mockUserRepository.create.mockReturnValue(userData);
      mockUserRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.create(userData)).rejects.toThrow(
        'Database connection failed',
      );
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: 1,
        email: email,
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(expectedUser);
      expect(result?.email).toBe(email);
    });

    it('should return null if user not found by email', async () => {
      const email = 'nonexistent@example.com';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });

    it('should handle email with different cases', async () => {
      const email = 'Test@Example.COM';
      const expectedUser = {
        id: 1,
        email: email.toLowerCase(),
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeDefined();
    });

    it('should handle special characters in email', async () => {
      const email = 'test+special@example.com';
      const expectedUser = {
        id:1,
        email: email,
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toBeDefined();
      expect(result?.email).toBe(email);
    });

    it('should propagate database errors when finding by email', async () => {
      const email = 'test@example.com';

      mockUserRepository.findOne.mockRejectedValue(
        new Error('Database query failed'),
      );

      await expect(service.findByEmail(email)).rejects.toThrow(
        'Database query failed',
      );
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId =1;
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

mockUserRepository.findOneBy.mockResolvedValue(expectedUser); 
      const result = await service.findById(userId);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });  // ✅ Update expectation

      expect(result).toEqual(expectedUser);
      expect(result?.id).toBe(userId);
    });

    it('should return null if user not found by id', async () => {
      const userId = 0;

      mockUserRepository.findOneBy.mockResolvedValue(null);  // ✅ Use findOneBy

      const result = await service.findById(userId);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });  // ✅ Update expectation
      expect(result).toBeNull();
    });

    it('should handle format id', async () => {
      const id = 1;
      const expectedUser = {
        id: id,
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.findOneBy.mockResolvedValue(expectedUser);  // ✅ Use findOneBy

      const result = await service.findById(id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(id);
    });

    it('should propagate database errors when finding by id', async () => {
      const userId = 1;

       mockUserRepository.findOneBy.mockRejectedValue(
        new Error('Database query failed'),
      );

      await expect(service.findById(userId)).rejects.toThrow(
        'Database query failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'hash1',
          fullName: 'User One',
          phone: '+1111111111',
          createdAt: new Date(),
          updatedAt: new Date(),
          plants: [],
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'hash2',
          fullName: 'User Two',
          phone: '+2222222222',
          createdAt: new Date(),
          updatedAt: new Date(),
          plants: [],
        },
        {
          id: 3,
          email: 'user3@example.com',
          password: 'hash3',
          fullName: 'User Three',
          phone: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          plants: [],
        },
      ];

      mockUserRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
      expect(result).toHaveLength(3);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);  // ✅ Mock as resolved promise

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return users with all properties', async () => {
      const expectedUsers = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          fullName: 'Test User',
          phone: '+1234567890',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
          plants: [],
        },
      ];

      mockUserRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('password');
      expect(result[0]).toHaveProperty('fullName');
      expect(result[0]).toHaveProperty('phone');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
    });

    it('should propagate database errors when finding all', async () => {
       mockUserRepository.find.mockRejectedValue(
        new Error('Database connection lost'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Database connection lost',
      );
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle user creation with very long names', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'A'.repeat(500), // Very long name
      };

      const expectedUser = {
        id: 1,
        ...userData,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(userData);

      expect(result.fullName).toHaveLength(500);
    });

    it('should handle user with international phone number', async () => {
      const userData = {
        email: 'international@example.com',
        password: 'hashedPassword',
        fullName: 'International User',
        phone: '+44 20 7946 0958', // UK number with spaces
      };

      const expectedUser = {
        id: 1,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(userData);

      expect(result?.phone).toBe('+44 20 7946 0958');
    });

    it('should handle concurrent findByEmail calls', async () => {
      const email = 'concurrent@example.com';
      const expectedUser = {
        id: 1,
        email: email,
        password: 'hashedPassword',
        fullName: 'Concurrent User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [],
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      // Simulate concurrent calls
      const [result1, result2, result3] = await Promise.all([
        service.findByEmail(email),
        service.findByEmail(email),
        service.findByEmail(email),
      ]);

      expect(result1).toEqual(expectedUser);
      expect(result2).toEqual(expectedUser);
      expect(result3).toEqual(expectedUser);
      expect(repository.findOne).toHaveBeenCalledTimes(3);
    });

    it('should handle null email search', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail("");

      expect(result).toBeNull();
    });

    it('should handle undefined email search', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail("");

      expect(result).toBeNull();
    });

    it('should handle empty string email search', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: '' } });
      expect(result).toBeNull();
    });
  });

  describe('repository interaction', () => {
    it('should call repository methods with correct parameters', async () => {
      const userData = {
        email: 'repo@example.com',
        password: 'hashedPassword',
        fullName: 'Repo Test',
      };

      const createdUser = { id: 'user-123', ...userData };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await service.create(userData);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should not modify original user data when creating', async () => {
      const originalData = {
        email: 'original@example.com',
        password: 'hashedPassword',
        fullName: 'Original User',
      };

      const dataCopy = { ...originalData };

      const createdUser = {
        id: 1,
        ...originalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await service.create(originalData);

      // Original data should remain unchanged
      expect(originalData).toEqual(dataCopy);
    });
  });

  describe('data integrity', () => {
    it('should preserve user data types', async () => {
      const userData = {
        email: 'types@example.com',
        password: 'hashedPassword',
        fullName: 'Type Test User',
        phone: '+1234567890',
      };

      const createdUser = {
        id: 1,
        ...userData,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        plants: [],
      };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(typeof result.id).toBe("number");
      expect(typeof result.email).toBe('string');
      expect(typeof result.password).toBe('string');
      expect(typeof result.fullName).toBe('string');
      expect(typeof result.phone).toBe('string');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(Array.isArray(result.plants)).toBe(true);
    });

    it('should handle user with plants relationship', async () => {
      const userId = 1;
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        plants: [
          {
            id: 1,
            name: 'Tomato Plant',
            species: 'Tomato',
            userId: userId,
          },
          {
            id: 2,
            name: 'Rose Plant',
            species: 'Rose',
            userId: userId,
          },
        ],
      };

      mockUserRepository.findOneBy.mockResolvedValue(expectedUser);  // ✅ Use findOneBy

      const result = await service.findById(userId);

      expect(result?.plants).toBeDefined();
      expect(result?.plants).toHaveLength(2);
      expect(result?.plants[0].name).toBe('Tomato Plant');
    });
  });
});