import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@Request() req: FastifyRequest) {
    //only the user can access his account info
    return this.userService.getUserById(req.user.sub);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Request() req: FastifyRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(req.user.sub, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteUser(@Request() req: FastifyRequest) {
    return this.userService.deleteUser(req.user.sub);
  }
}
