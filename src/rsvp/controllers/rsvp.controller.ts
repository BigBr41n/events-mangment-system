import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RsvpService } from '../services/rsvp.service';
import { CreateRsvpDto } from '../dtos/CreateRsvp.dto';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { FastifyRequest } from 'fastify';

@Controller('api/v1/rsvp')
export class RsvpController {
  constructor(private readonly eventService: RsvpService) {}

  @Get(':eventId/schedule')
  @UseGuards(JwtAuthGuard)
  async getEventSchedule(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
  ): Promise<Event> {
    return this.eventService.getEventSchedule(eventId);
  }

  @Post(':eventId')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getUserRsvps(@Request() req: FastifyRequest): Promise<Rsvp[]> {
    return this.eventService.getUserRsvps(req.user.sub);
  }
}
