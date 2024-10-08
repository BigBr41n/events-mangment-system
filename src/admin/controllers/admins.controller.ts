import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from '../services/admins.service';
import { Event } from '../../typeorm/Event.entity';
import { User } from '../../typeorm/User.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { UpdateUserRoleDto } from '../dtos/UpdateUserData.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { RoleGuard } from '../../common/guards/Role.guard';
import { Role } from '../../common/decorators/role.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Role('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiOkResponse({
    description: 'Successfully retrieved all events.',
    type: [Event],
  })
  async getAllEvents(): Promise<Event[]> {
    return this.adminService.findAllEvents();
  }

  @Put('events/:eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an event by ID' })
  @ApiOkResponse({
    description: 'Successfully updated the event.',
    type: Event,
  })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  async updateEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.adminService.updateEventById(eventId, updateEventDto);
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Successfully retrieved all users.',
    type: [User],
  })
  async getAllUsers(): Promise<User[]> {
    return this.adminService.findAllUsers();
  }

  @Put('users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user role by user ID' })
  @ApiOkResponse({
    description: 'Successfully updated the user role.',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updateUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    return this.adminService.updateUserRoleByEmail(updateUserRoleDto);
  }
}
