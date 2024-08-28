import { Test, TestingModule } from '@nestjs/testing';
import { RsvpController } from './rsvp.controller';
import { RsvpService } from '../services/rsvp.service';
import { Event } from '../../typeorm/Event.entity';
import { Rsvp } from '../../typeorm/Rsvp.entity';
import { NotFoundException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

describe('RsvpController', () => {
  let controller: RsvpController;
  let rsvpService: RsvpService;

  const mockEvent = { id: '1', title: 'Test Event', schedule: '2024-01-01' };
  const mockRsvp = { id: '1', eventId: '1', userId: 'user1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RsvpController],
      providers: [
        {
          provide: RsvpService,
          useValue: {
            getEventSchedule: jest.fn().mockResolvedValue(mockEvent),
            rsvpToEvent: jest.fn().mockResolvedValue(mockRsvp),
            getUserRsvps: jest.fn().mockResolvedValue([mockRsvp]),
          },
        },
      ],
    }).compile();

    controller = module.get<RsvpController>(RsvpController);
    rsvpService = module.get<RsvpService>(RsvpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEventSchedule', () => {
    it('should return the event schedule', async () => {
      const result = await controller.getEventSchedule('1');
      expect(result).toEqual(mockEvent);
      expect(rsvpService.getEventSchedule).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if event does not exist', async () => {
      rsvpService.getEventSchedule = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.getEventSchedule('2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('rsvpToEvent', () => {
    it('should RSVP to an event and return the RSVP', async () => {
      const req = { user: { sub: 'user1' } } as FastifyRequest;
      const result = await controller.rsvpToEvent('1', req);
      expect(result).toEqual(mockRsvp);
      expect(rsvpService.rsvpToEvent).toHaveBeenCalledWith({
        eventId: '1',
        userId: req.user.sub,
      });
    });

    it('should throw NotFoundException if event does not exist or RSVP already exists', async () => {
      rsvpService.rsvpToEvent = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException());
      const req = { user: { sub: 'user1' } } as FastifyRequest;
      await expect(controller.rsvpToEvent('2', req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserRsvps', () => {
    it('should return all RSVPs for the user', async () => {
      const req = { user: { sub: 'user1' } } as FastifyRequest;
      const result = await controller.getUserRsvps(req);
      expect(result).toEqual([mockRsvp]);
      expect(rsvpService.getUserRsvps).toHaveBeenCalledWith(req.user.sub);
    });
  });
});
