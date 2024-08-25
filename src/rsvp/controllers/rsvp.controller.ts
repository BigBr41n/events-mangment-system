import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RsvpService } from '../services/rsvp.service';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { FastifyRequest } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Rsvp')
@Controller('api/v1/rsvp')
export class RsvpController {
  constructor(private readonly eventService: RsvpService) {}

  @Get(':eventId/schedule')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event schedule by event ID' })
  @ApiParam({ name: 'eventId', description: 'UUID of the event' })
  @ApiResponse({
    status: 200,
    description: 'Event schedule retrieved successfully.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async getEventSchedule(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
  ): Promise<Event> {
    return this.eventService.getEventSchedule(eventId);
  }

  @Post(':eventId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'RSVP to an event' })
  @ApiParam({ name: 'eventId', description: 'UUID of the event' })
  @ApiResponse({
    status: 201,
    description: 'RSVP created successfully.',
    type: Rsvp,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found or RSVP already exists.',
  })
  async rsvpToEvent(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Request() req: FastifyRequest,
  ): Promise<Rsvp | { message: string }> {
    const data = {
      eventId,
      userId: req.user.sub,
    };
    return this.eventService.rsvpToEvent(data);
  }

  @Get('user/rsvps')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all RSVPs for a user' })
  @ApiResponse({
    status: 200,
    description: 'User RSVPs retrieved successfully.',
    type: [Rsvp],
  })
  async getUserRsvps(@Request() req: FastifyRequest): Promise<Rsvp[]> {
    return this.eventService.getUserRsvps(req.user.sub);
  }
}
