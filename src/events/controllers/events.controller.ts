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
} from '@nestjs/common';
import { EventService } from '../services/events.service';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { Event } from '../../typeorm/Event.entity';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { OrganizerGuard } from '../../common/guards/Orgnizer.guard';
import { FastifyRequest } from 'fastify';

@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  // POST /api/v1/events
  @Post()
  @UseGuards(JwtAuthGuard, OrganizerGuard)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Request() req: FastifyRequest,
  ): Promise<Event> {
    return this.eventService.create(req.user.sub, createEventDto);
  }

  // GET /api/v1/events
  @Get()
  async getAllEvents(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  // GET /api/v1/events/:eventId
  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string): Promise<Event> {
    return this.eventService.findOne(eventId);
  }

  // PUT /api/v1/events/:eventId
  @Put(':eventId')
  @UseGuards(JwtAuthGuard, OrganizerGuard)
  async updateEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(eventId, updateEventDto);
  }

  // DELETE /api/v1/events/:eventId
  @Delete(':eventId')
  @UseGuards(JwtAuthGuard, OrganizerGuard)
  async deleteEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ): Promise<void> {
    return this.eventService.remove(eventId);
  }
}
