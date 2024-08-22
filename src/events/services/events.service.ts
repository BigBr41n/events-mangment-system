import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/Event.entity';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  // Create a new event
  async create(
    organizerId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId,
    });
    return this.eventRepository.save(event);
  }

  // Get all events
  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  // Get a single event by ID
  async findOne(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }

  // Update an event by ID
  async update(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(eventId);

    const updatedEvent = this.eventRepository.merge(event, updateEventDto);
    return this.eventRepository.save(updatedEvent);
  }

  // Delete an event by ID
  async remove(eventId: string): Promise<void> {
    const event = await this.findOne(eventId);
    await this.eventRepository.remove(event);
  }
}
