import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/Event.entity';
import { Feedback } from '../../typeorm/Feedback.entity';
import { CreateFeedbackDto } from '../dtos/CreateFeedback.dto';
import { UpdateFeedbackDto } from '../dtos/UpdateFeedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  // POST /api/v1/events/:eventId/feedback
  async createFeedback(
    eventId: string,
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
    });

    return this.feedbackRepository.save(feedback);
  }

  // GET /api/v1/events/:eventId/feedback
  async findAllFeedbacksForEvent(eventId: string): Promise<Feedback[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.feedbackRepository.find({
      where: { event: { id: eventId } },
    });
  }

  // DELETE /api/v1/events/:eventId/:feedbackId
  async deleteFeedback(feedbackId: string): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

    await this.feedbackRepository.remove(feedback);
  }

  // PUT /api/v1/events/:eventId/:feedbackId
  async updateFeedback(
    feedbackId: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

    const updatedFeedback = this.feedbackRepository.merge(
      feedback,
      updateFeedbackDto,
    );
    return this.feedbackRepository.save(updatedFeedback);
  }
}
