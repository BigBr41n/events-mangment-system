import { Module } from '@nestjs/common';
import { FeedbacksController } from './controller/feedbacks.controller';
import { FeedbacksService } from './services/feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from '../typeorm/Feedback.entity';
import { Event } from '../typeorm/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Event])],
  exports: [],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
