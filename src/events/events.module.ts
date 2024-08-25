import { Module } from '@nestjs/common';
import { EventService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../typeorm/Event.entity';
import { EventsGateway } from './socket/events.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { Rsvp } from '../typeorm/Rsvp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Rsvp]), NotificationsModule],
  providers: [EventService, EventsGateway],
  controllers: [EventsController],
})
export class EventsModule {}
