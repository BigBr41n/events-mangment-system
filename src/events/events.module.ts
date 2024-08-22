import { Module } from '@nestjs/common';
import { EventService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../typeorm/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventService],
  controllers: [EventsController],
})
export class EventsModule {}
