import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { User } from '../../../typeorm/User.entity';
import { Token } from '../../types/Token.type';
import { FastifyRequest } from 'fastify';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT access and refresh tokens', async () => {
      const mockToken: Token = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      };
      const mockUser = {
        id: 'UUID-UUID-UUID-UUID',
        role: 'Attendee',
        username: 'user',
        passwordHash: 'hashValue-256',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const req: any = { user: mockUser };
      expect(await authController.login(req)).toEqual(mockToken);
    });
    it('should handle invalid login credentials', async () => {
      const mockUser = {
        id: 'UUID-UUID-UUID-UUID',
        username: 'user',
        role: 'Attendee',
        passwordHash: 'hashValue-256',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      const req: any = { user: mockUser };
      await expect(authController.login(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return the user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user',
        password: 'pass',
        email: 'email@example.com',
        role: 'Organizer',
      };
      const mockUser = {
        id: 'UUID-UUID-UUID-UUID',
        username: 'user',
        role: 'Attendee',
      } as User;

      jest.spyOn(authService, 'register').mockResolvedValue(mockUser as User);

      expect(await authController.register(createUserDto)).toEqual(mockUser);
    });
    it('should return a conflict error if the user is already registered', () => {
      const createUserDto: CreateUserDto = {
        username: 'user',
        password: 'pass',
        email: 'email@example.com',
        role: 'Organizer',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new ConflictException('User already exists'));

      expect(authController.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
