import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksService } from './feedbacks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from '../../typeorm/Feedback.entity';
import { Event } from '../../typeorm/Event.entity';
import { CreateFeedbackDto } from '../dtos/CreateFeedback.dto';
import { UpdateFeedbackDto } from '../dtos/UpdateFeedback.dto';
import { NotFoundException } from '@nestjs/common';

describe('FeedbacksService', () => {
  let service: FeedbacksService;
  let feedbackRepositoryMock: any;
  let eventRepositoryMock: any;

  const mockEvent = { id: '1', title: 'Test Event' };
  const mockFeedback = { id: '1', content: 'Great event!', event: mockEvent };

  beforeEach(async () => {
    feedbackRepositoryMock = {
      create: jest.fn().mockReturnValue(mockFeedback),
      save: jest.fn().mockResolvedValue(mockFeedback),
      find: jest.fn().mockResolvedValue([mockFeedback]),
      findOne: jest.fn().mockResolvedValue(mockFeedback),
      remove: jest.fn().mockResolvedValue(undefined),
      merge: jest.fn().mockReturnValue(mockFeedback),
    };

    eventRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(mockEvent),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbacksService,
        { provide: getRepositoryToken(Event), useValue: eventRepositoryMock },
        {
          provide: getRepositoryToken(Feedback),
          useValue: feedbackRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FeedbacksService>(FeedbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeedback', () => {
    it('should create and return feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = {
        comment: 'Great event!',
        rating: 4,
      };
      const result = await service.createFeedback('1', createFeedbackDto);
      expect(result).toEqual(mockFeedback);
      expect(eventRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(feedbackRepositoryMock.save).toHaveBeenCalledWith(mockFeedback);
    });

    it('should throw NotFoundException if event does not exist', async () => {
      eventRepositoryMock.findOne.mockResolvedValueOnce(null);
      const createFeedbackDto: CreateFeedbackDto = {
        comment: 'Great event!',
        rating: 0,
      };
      await expect(
        service.createFeedback('2', createFeedbackDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllFeedbacksForEvent', () => {
    it('should return an array of feedbacks for a specific event', async () => {
      const result = await service.findAllFeedbacksForEvent('1');
      expect(result).toEqual([mockFeedback]);
      expect(eventRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(feedbackRepositoryMock.find).toHaveBeenCalledWith({
        where: { event: { id: '1' } },
      });
    });

    it('should throw NotFoundException if event does not exist', async () => {
      eventRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findAllFeedbacksForEvent('2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteFeedback', () => {
    it('should delete feedback', async () => {
      await service.deleteFeedback('1');
      expect(feedbackRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(feedbackRepositoryMock.remove).toHaveBeenCalledWith(mockFeedback);
    });

    it('should throw NotFoundException if feedback does not exist', async () => {
      feedbackRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.deleteFeedback('2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback and return it', async () => {
      const updateFeedbackDto: UpdateFeedbackDto = {
        comment: 'Updated feedback!',
      };
      const result = await service.updateFeedback('1', updateFeedbackDto);
      expect(result).toEqual(mockFeedback);
      expect(feedbackRepositoryMock.merge).toHaveBeenCalledWith(
        mockFeedback,
        updateFeedbackDto,
      );
      expect(feedbackRepositoryMock.save).toHaveBeenCalledWith(mockFeedback);
    });

    it('should throw NotFoundException if feedback does not exist', async () => {
      feedbackRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.updateFeedback('2', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
