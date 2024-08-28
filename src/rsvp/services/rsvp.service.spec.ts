import { Test, TestingModule } from '@nestjs/testing';
import { RsvpService } from './rsvp.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { CreateRsvpDto } from '../dtos/CreateRsvp.dto';
import { NotFoundException } from '@nestjs/common';

describe('RsvpService', () => {
  let service: RsvpService;
  let eventRepositoryMock: any;
  let rsvpRepositoryMock: any;

  const mockEvent = { id: '1', title: 'Test Event', capacity: 10, rsvps: [] };
  const mockRsvp = {
    id: '1',
    userId: 'user1',
    eventId: '1',
    status: 'Confirmed',
  };

  beforeEach(async () => {
    eventRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(mockEvent),
      save: jest.fn().mockResolvedValue(mockEvent),
    };

    rsvpRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue(mockRsvp),
      save: jest.fn().mockResolvedValue(mockRsvp),
      find: jest.fn().mockResolvedValue([mockRsvp]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsvpService,
        { provide: getRepositoryToken(Event), useValue: eventRepositoryMock },
        { provide: getRepositoryToken(Rsvp), useValue: rsvpRepositoryMock },
      ],
    }).compile();

    service = module.get<RsvpService>(RsvpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEventSchedule', () => {
    it('should return the event schedule', async () => {
      const result = await service.getEventSchedule('1');
      expect(result).toEqual(mockEvent);
      expect(eventRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['rsvps'],
      });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      eventRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.getEventSchedule('2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('rsvpToEvent', () => {
    it('should RSVP to an event and return the RSVP', async () => {
      const createRsvpDto: CreateRsvpDto = { eventId: '1', userId: 'user1' };
      const result = await service.rsvpToEvent(createRsvpDto);
      expect(result).toEqual(mockRsvp);
      expect(eventRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(rsvpRepositoryMock.save).toHaveBeenCalledWith(mockRsvp);
      expect(eventRepositoryMock.save).toHaveBeenCalledWith({
        ...mockEvent,
        capacity: 9,
      });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      const createRsvpDto: CreateRsvpDto = { eventId: '2', userId: 'user1' };
      eventRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.rsvpToEvent(createRsvpDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if RSVP already exists', async () => {
      const createRsvpDto: CreateRsvpDto = { eventId: '1', userId: 'user1' };
      rsvpRepositoryMock.findOne.mockResolvedValueOnce(mockRsvp);
      await expect(service.rsvpToEvent(createRsvpDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a message if event capacity is exceeded', async () => {
      const createRsvpDto: CreateRsvpDto = { eventId: '1', userId: 'user1' };
      mockEvent.capacity = 0; // Simulating full capacity
      const result = await service.rsvpToEvent(createRsvpDto);
      expect(result).toEqual({
        message: 'The maximum capacity of this event is exceeded',
      });
    });
  });

  describe('getUserRsvps', () => {
    it('should return all RSVPs for the user', async () => {
      const result = await service.getUserRsvps('user1');
      expect(result).toEqual([mockRsvp]);
      expect(rsvpRepositoryMock.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        relations: ['event'],
      });
    });
  });
});
