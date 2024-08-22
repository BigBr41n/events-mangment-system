import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from '../services/admins.service';
import { Event } from '../../typeorm/Event.entity';
import { User } from '../../typeorm/User.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { UpdateUserRoleDto } from '../dtos/UpdateUserData.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { AdminRoleGuard } from '../guards/AdminGuard.guard';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('events')
  async getAllEvents(): Promise<Event[]> {
    return this.adminService.findAllEvents();
  }

  @Put('events/:eventId')
  async updateEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.adminService.updateEventById(eventId, updateEventDto);
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.findAllUsers();
  }

  @Put('users/:userId')
  async updateUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    return this.adminService.updateUserRoleByEmail(updateUserRoleDto);
  }
}
