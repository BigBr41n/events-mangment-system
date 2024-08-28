import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventService } from '../services/events.service';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { Event } from '../../typeorm/Event.entity';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventService;
  let jwtService: JwtService;

  const mockEventService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventService>(EventService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        /* ... */
      } as CreateEventDto;
      const user = { sub: 'user-id' };
      const mockEvent: Event = {
        /* ... */
      } as Event;

      jest.spyOn(service, 'create').mockResolvedValue(mockEvent);

      const req = { user: user } as FastifyRequest;
      const result = await controller.createEvent(createEventDto, req);

      expect(result).toEqual(mockEvent);
      expect(service.create).toHaveBeenCalledWith(user.sub, createEventDto);
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const mockEvents: Event[] = [
        /* ... */
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockEvents);

      const result = await controller.getAllEvents();

      expect(result).toEqual(mockEvents);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getEventById', () => {
    it('should return an event by ID', async () => {
      const eventId = 'event-id';
      const mockEvent: Event = {
        /* ... */
      } as Event;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEvent);

      const result = await controller.getEventById(eventId);

      expect(result).toEqual(mockEvent);
      expect(service.findOne).toHaveBeenCalledWith(eventId);
    });

    it('should throw NotFoundException if event is not found', async () => {
      const eventId = 'event-id';
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.getEventById(eventId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const eventId = 'event-id';
      const updateEventDto: UpdateEventDto = {
        /* ... */
      };
      const mockEvent: Event = {
        /* ... */
      } as Event;

      jest.spyOn(service, 'update').mockResolvedValue(mockEvent);

      const result = await controller.updateEvent(eventId, updateEventDto);

      expect(result).toEqual(mockEvent);
      expect(service.update).toHaveBeenCalledWith(eventId, updateEventDto);
    });

    it('should throw NotFoundException if event is not found', async () => {
      const eventId = 'event-id';
      const updateEventDto: UpdateEventDto = {
        /* ... */
      };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateEvent(eventId, updateEventDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const eventId = 'event-id';

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.deleteEvent(eventId)).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith(eventId);
    });

    it('should throw NotFoundException if event is not found', async () => {
      const eventId = 'event-id';

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.deleteEvent(eventId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
