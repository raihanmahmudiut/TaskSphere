import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockCompare = bcrypt.compare as jest.Mock;
describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    uuid: 'test-uuid-123',
    email: 'test@example.com',
    name: 'Test User',
    hashedPassword: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    uuid: 'test-uuid-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCompare.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserCredentials', () => {
    it('should return user when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUserCredentials(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(undefined);

      await expect(
        service.validateUserCredentials('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValueOnce(false);

      await expect(
        service.validateUserCredentials('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(mockUserWithoutPassword);

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: mockUserWithoutPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUserWithoutPassword.email,
        sub: mockUserWithoutPassword.uuid,
      });
    });
  });

  describe('register', () => {
    it('should create user and return login result', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      usersService.create.mockResolvedValue(mockUserWithoutPassword);
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: mockUserWithoutPassword,
      });
    });
  });
});
