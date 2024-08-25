import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/Event.entity';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { EventsGateway } from '../socket/events.gateway';
import { NotificationsGateway } from '../../notifications/gateway/notifications.gateway';
import { Rsvp } from '../../typeorm/Rsvp.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Rsvp)
    private readonly rsvpRepository: Repository<Rsvp>,
    private readonly eventsGateway: EventsGateway,
    private readonly notificationsGateway: NotificationsGateway,
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

    const savedEvent = await this.eventRepository.save(event);

    void this.sendEventTypeNotification(event.category);

    return this.eventRepository.save(savedEvent);
  }

  // sendEventTypeNotification based on the category
  private async sendEventTypeNotification(category: Event['category']) {
    try {
      const rsvps = await this.rsvpRepository.find({
        relations: ['user'],
        where: { event: { category } },
        select: {
          user: { id: true },
          event: { id: true, category: true },
        },
      });

      rsvps.forEach((rsvp) => {
        this.notificationsGateway.sendNotification(
          rsvp.user.id,
          'New Event Alert',
          `You have a new event to in the ${rsvp.event.category} category`,
          'Reminder',
        );
      });
    } catch (error) {
      console.error('Error sending event type notification:', error);
    }
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

    //after updating the event , emit it to the socket
    this.eventsGateway.sendEventUpdate(event.id, updatedEvent);

    //notify the users that already joined the event
    const joinedUsers = await this.rsvpRepository.find({
      where: { eventId: event.id, status: 'Confirmed' },
    });

    //send the notifications
    joinedUsers.forEach((user) => {
      this.notificationsGateway.sendNotification(
        user.userId,
        event.id,
        `Event ${event.title} has been updated`,
        'Update',
      );
    });

    //return to the client
    return this.eventRepository.save(updatedEvent);
  }

  // Delete an event by ID
  async remove(eventId: string): Promise<void> {
    const event = await this.findOne(eventId);
    await this.eventRepository.remove(event);
  }
}
