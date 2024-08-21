import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Request() req: FastifyRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    //only the user can update his info
    if (req.user.id !== userId) {
      throw new ForbiddenException('Unauthorized to update this user');
    }
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  deleteUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Request() req: FastifyRequest,
  ) {
    //only the user can delete his info
    if (req.user.sub !== userId) {
      throw new ForbiddenException('Unauthorized to delete this user');
    }
    return this.userService.deleteUser(userId);
  }
}
