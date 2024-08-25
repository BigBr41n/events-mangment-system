import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../guards/LocalAuthGuard.guard';
import { AuthService } from '../../services/auth/auth.service';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { Request } from '@nestjs/common';
import { User } from '../../../typeorm/User.entity';
import { Token } from '../../types/Token.type';
import { RefreshAuthGuard } from '../../guards/RefreshAuthGuard.guard';
import { FastifyRequest } from 'fastify';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'returns JWT access and refresh tokens' })
  @ApiOkResponse({ description: 'return JWT access and refresh tokens' })
  @ApiNotFoundResponse({ description: 'user not found with the id sent' })
  @ApiUnauthorizedResponse({
    description: 'not authorized, Invalid Credentials',
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<Token> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: CreateUserDto,
  ): Promise<Partial<User> | { message: string }> {
    return this.authService.register(registerUserDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT access token' })
  @ApiOkResponse({ description: 'returns new JWT access token' })
  @ApiUnauthorizedResponse({
    description: 'not authorized, Invalid Refresh Token',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(
    @Request() req: FastifyRequest,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshTOken(req.user);
  }
}
