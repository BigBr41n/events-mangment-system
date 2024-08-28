import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { EventsGateway } from '../socket/events.gateway';
import { NotificationsGateway } from '../../notifications/gateway/notifications.gateway';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let eventRepositoryMock: any;
  let rsvpRepositoryMock: any;
  let eventsGatewayMock: any;
  let notificationsGatewayMock: any;

  const mockEvent = {
    id: '1',
    title: 'Test Event',
    category: 'Test',
    organizerId: 'organizer1',
  };
  const mockRsvp = { userId: 'user1', eventId: '1', status: 'Confirmed' };

  beforeEach(async () => {
    eventRepositoryMock = {
      create: jest.fn().mockReturnValue(mockEvent),
      save: jest.fn().mockResolvedValue(mockEvent),
      find: jest.fn().mockResolvedValue([mockEvent]),
      findOne: jest.fn().mockResolvedValue(mockEvent),
      remove: jest.fn().mockResolvedValue(undefined),
      merge: jest.fn().mockReturnValue(mockEvent),
    };

    rsvpRepositoryMock = {
      find: jest.fn().mockResolvedValue([mockRsvp]),
    };

    eventsGatewayMock = {
      sendEventUpdate: jest.fn(),
    };

    notificationsGatewayMock = {
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getRepositoryToken(Event), useValue: eventRepositoryMock },
        { provide: getRepositoryToken(Rsvp), useValue: rsvpRepositoryMock },
        { provide: EventsGateway, useValue: eventsGatewayMock },
        { provide: NotificationsGateway, useValue: notificationsGatewayMock },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        category: 'Tech',
        startDate: new Date(),
        endDate: new Date(),
        location: 'New Location',
        description: 'New Event',
        capacity: 100,
      };
      const result = await service.create('organizer1', createEventDto);
      expect(result).toEqual(mockEvent);
      expect(eventRepositoryMock.save).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockEvent]);
      expect(eventRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockEvent);
      expect(eventRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      eventRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event and send notifications', async () => {
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const result = await service.update('1', updateEventDto);
      expect(result).toEqual(mockEvent);
      expect(eventRepositoryMock.merge).toHaveBeenCalledWith(
        mockEvent,
        updateEventDto,
      );
      expect(eventsGatewayMock.sendEventUpdate).toHaveBeenCalledWith(
        '1',
        mockEvent,
      );
      expect(notificationsGatewayMock.sendNotification).toHaveBeenCalledWith(
        mockRsvp.userId,
        '1',
        `Event ${mockEvent.title} has been updated`,
        'Update',
      );
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      await service.remove('1');
      expect(eventRepositoryMock.remove).toHaveBeenCalledWith(mockEvent);
    });
  });
});
