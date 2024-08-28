import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from '../services/feedbacks.service';
import { CreateFeedbackDto } from '../dtos/CreateFeedback.dto';
import { UpdateFeedbackDto } from '../dtos/UpdateFeedback.dto';
import { Feedback } from '../../typeorm/Feedback.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { FastifyRequest } from 'fastify';

describe('FeedbacksController', () => {
  let controller: FeedbacksController;
  let feedbacksService: FeedbacksService;

  const mockFeedback = {
    id: '1',
    content: 'Great event!',
    userId: 'user1',
    eventId: 'event1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbacksController],
      providers: [
        {
          provide: FeedbacksService,
          useValue: {
            createFeedback: jest.fn().mockResolvedValue(mockFeedback),
            findAllFeedbacksForEvent: jest
              .fn()
              .mockResolvedValue([mockFeedback]),
            deleteFeedback: jest.fn().mockResolvedValue(undefined),
            updateFeedback: jest.fn().mockResolvedValue(mockFeedback),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedbacksController>(FeedbacksController);
    feedbacksService = module.get<FeedbacksService>(FeedbacksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFeedback', () => {
    it('should create and return feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = {
        comment: 'Great event!',
        rating: 5,
      };
      const req = { user: { sub: 'user1' } } as FastifyRequest;
      const result = await controller.createFeedback(
        'event1',
        createFeedbackDto,
        req,
      );
      expect(result).toEqual(mockFeedback);
      expect(feedbacksService.createFeedback).toHaveBeenCalledWith('event1', {
        ...createFeedbackDto,
        userId: req.user.sub,
      });
    });
  });

  describe('findAllFeedbacksForEvent', () => {
    it('should return an array of feedbacks for a specific event', async () => {
      const result = await controller.findAllFeedbacksForEvent('event1');
      expect(result).toEqual([mockFeedback]);
      expect(feedbacksService.findAllFeedbacksForEvent).toHaveBeenCalledWith(
        'event1',
      );
    });
  });

  describe('deleteFeedback', () => {
    it('should delete feedback for a specific event', async () => {
      await controller.deleteFeedback('event1', '1');
      expect(feedbacksService.deleteFeedback).toHaveBeenCalledWith('1');
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback and return it', async () => {
      const updateFeedbackDto: UpdateFeedbackDto = {
        comment: 'Updated feedback!',
      };
      feedbacksService.findAllFeedbacksForEvent = jest
        .fn()
        .mockResolvedValue([mockFeedback]);

      const result = await controller.updateFeedback(
        'event1',
        '1',
        updateFeedbackDto,
      );
      expect(result).toEqual(mockFeedback);
      expect(feedbacksService.updateFeedback).toHaveBeenCalledWith(
        '1',
        updateFeedbackDto,
      );
    });

    it('should throw NotFoundException if feedback does not exist', async () => {
      feedbacksService.findAllFeedbacksForEvent = jest
        .fn()
        .mockResolvedValue([]);

      await expect(
        controller.updateFeedback('event1', '1', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
