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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<Token> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: CreateUserDto,
  ): Promise<Partial<User> | { message: string }> {
    return this.authService.register(registerUserDto);
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(
    @Request() req: FastifyRequest,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshTOken(req.user);
  }
}
