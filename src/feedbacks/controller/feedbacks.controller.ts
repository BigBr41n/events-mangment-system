import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FeedbacksService } from '../services/feedbacks.service';
import { CreateFeedbackDto } from '../dtos/CreateFeedback.dto';
import { UpdateFeedbackDto } from '../dtos/UpdateFeedback.dto';
import { Feedback } from '../../typeorm/Feedback.entity';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { FastifyRequest } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Feedbacks')
@Controller('api/v1/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully.',
    type: Feedback,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async createFeedback(
    @Param('eventId') eventId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: FastifyRequest,
  ): Promise<Feedback> {
    const data = {
      ...createFeedbackDto,
      userId: req.user.sub,
    };
    return this.feedbacksService.createFeedback(eventId, data);
  }

  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all feedback for a specific event' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved feedback.',
    type: [Feedback],
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async findAllFeedbacksForEvent(
    @Param('eventId') eventId: string,
  ): Promise<Feedback[]> {
    return this.feedbacksService.findAllFeedbacksForEvent(eventId);
  }

  @Delete(':eventId/:feedbackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feedback for a specific event' })
  @ApiResponse({ status: 204, description: 'Feedback deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  async deleteFeedback(
    @Param('eventId') eventId: string,
    @Param('feedbackId') feedbackId: string,
  ): Promise<void> {
    return this.feedbacksService.deleteFeedback(feedbackId);
  }

  @Put(':feedbackId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a feedback for a specific event' })
  @ApiResponse({
    status: 200,
    description: 'Feedback updated successfully.',
    type: Feedback,
  })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  async updateFeedback(
    @Param('eventId') eventId: string,
    @Param('feedbackId') feedbackId: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedbacks =
      await this.feedbacksService.findAllFeedbacksForEvent(eventId);
    if (!feedbacks.some((feedback) => feedback.id === feedbackId)) {
      throw new NotFoundException(
        `Feedback with ID ${feedbackId} not found in event with ID ${eventId}`,
      );
    }
    return this.feedbacksService.updateFeedback(feedbackId, updateFeedbackDto);
  }
}
