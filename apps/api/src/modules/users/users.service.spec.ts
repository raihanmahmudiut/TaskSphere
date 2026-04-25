import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';

describe('UsersService', () => {
  let service: UsersService;
  let mockDb: any;

  const mockUser = {
    uuid: 'test-uuid-123',
    email: 'test@example.com',
    name: 'Test User',
    hashedPassword: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockDb = {
      query: {
        users: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnValue({
        values: jest.fn().mockImplementation((data) => ({
          returning: jest.fn().mockResolvedValue([{ ...mockUser, ...data }]),
        })),
      }),
      update: jest.fn().mockReturnValue({
        set: jest.fn().mockImplementation((data) => ({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ ...mockUser, ...data }]),
          }),
        })),
      }),
      delete: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DRIZZLE_PROVIDER,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(result.email).toBe('new@example.com');
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException when email exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findById('test-uuid-123');

      expect(result?.uuid).toBe('test-uuid-123');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return undefined when user not found', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      const result = await service.findById('non-existent-uuid');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update user name', async () => {
      mockDb.query.users.findFirst.mockResolvedValueOnce(mockUser);

      const updateData = { name: 'Updated Name' };

      const result = await service.update('test-uuid-123', updateData);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      await expect(
        service.update('non-existent-uuid', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(mockUser);

      await service.delete('test-uuid-123');

      expect(mockDb.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockDb.query.users.findFirst.mockResolvedValue(undefined);

      await expect(service.delete('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users without hashed passwords', async () => {
      mockDb.query.users.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });
  });
});
