import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { CreateRsvpDto } from '../dtos/CreateRsvp.dto';

@Injectable()
export class RsvpService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Rsvp)
    private readonly rsvpRepository: Repository<Rsvp>,
  ) {}

  async getEventSchedule(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['rsvps'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }

  async rsvpToEvent(
    createRsvpDto: CreateRsvpDto,
  ): Promise<Rsvp | { message: string }> {
    const { eventId, userId } = createRsvpDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const existingRsvp = await this.rsvpRepository.findOne({
      where: { eventId, userId },
    });
    if (existingRsvp) {
      throw new NotFoundException(`RSVP for this event already exists`);
    }
    if (event.capacity <= 0) {
      return { message: 'The maximum capacity of this event is exceeded' };
    }
    event.capacity--;
    const rsvp = this.rsvpRepository.create({
      ...createRsvpDto,
      status: 'Confirmed',
    });
    await this.eventRepository.save(event);
    return this.rsvpRepository.save(rsvp);
  }

  async getUserRsvps(userId: string): Promise<Rsvp[]> {
    return this.rsvpRepository.find({
      where: { userId },
      relations: ['event'],
    });
  }
}
