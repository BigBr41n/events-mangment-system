import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm/User.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserData } from '../../types/UserData.type';
import { Credentials } from '../../types/credentials.type';
import { JwtPayload } from '../../types/jwt-payload.type';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user when credentials are valid', async () => {
      const credentials: Credentials = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      expect(await authService.validateUser(credentials)).toEqual(user);
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.validateUser({
          email: 'wrong@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.validateUser({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const user = {
        id: 'UUID',
        username: 'testuser',
        role: 'User',
        refreshToken: '',
      } as unknown as User;

      const mockToken = {
        access_token: 'Token',
        refresh_token: 'Token',
      };

      jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
        return 'Token';
      });
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      expect(await authService.login(user)).toEqual(mockToken);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return true when the refresh token is valid', async () => {
      const user = { id: '1', refreshToken: 'validToken' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(
        await authService.validateRefreshToken(user.id, 'validToken'),
      ).toBe(true);
    });

    it('should throw UnauthorizedException when the refresh token is invalid', async () => {
      const user = { id: '1', refreshToken: 'validToken' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(
        authService.validateRefreshToken(user.id, 'invalidToken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      const userData: UserData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        role: 'Attendee',
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ id: '1' } as User);

      await expect(authService.register(userData)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should save a new user and return the user data', async () => {
      const userData: UserData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        role: 'Attendee',
      };

      const savedUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'Attendee',
        status: 'approved',
        passwordHash: 'hashedPassword',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      jest.spyOn(userRepository, 'create').mockImplementation(
        (user) =>
          ({
            ...user,
            id: '1',
            passwordHash: 'hashedPassword',
          }) as User,
      );

      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result = await authService.register(userData);

      expect(result).toEqual(
        expect.objectContaining({
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
          status: savedUser.status,
        }),
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token', async () => {
      const payload: JwtPayload = {
        username: 'testuser',
        role: 'User',
        sub: '1',
      };
      const newAccessToken = { accessToken: 'newAccessToken' };

      jest.spyOn(jwtService, 'sign').mockReturnValue('newAccessToken');

      expect(await authService.refreshTOken(payload)).toEqual(newAccessToken);
    });
  });
});
