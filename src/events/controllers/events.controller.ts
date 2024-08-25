import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from '../services/events.service';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { Event } from '../../typeorm/Event.entity';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { RoleGuard } from '../../common/guards/Role.guard';
import { FastifyRequest } from 'fastify';
import { Role } from '../../common/decorators/role.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('events')
@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Organizer', 'Admin')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    type: Event,
  })
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Request() req: FastifyRequest,
  ): Promise<Event> {
    return this.eventService.create(req.user.sub, createEventDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiOkResponse({
    description: 'Successfully retrieved all events.',
    type: [Event],
  })
  async getAllEvents(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved the event.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async getEventById(@Param('eventId') eventId: string): Promise<Event> {
    return this.eventService.findOne(eventId);
  }

  @Put(':eventId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Organizer', 'Admin')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiOkResponse({
    description: 'Successfully updated the event.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async updateEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Organizer', 'Admin')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiCreatedResponse({ description: 'Successfully deleted the event.' })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  async deleteEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ): Promise<void> {
    return this.eventService.remove(eventId);
  }
}
