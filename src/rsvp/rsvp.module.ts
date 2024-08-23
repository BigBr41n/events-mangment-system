import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../typeorm/Event.entity';
import { Rsvp } from '../typeorm/Rsvp.entity';
import { User } from '../typeorm/User.entity';
import { RsvpService } from './services/rsvp.service';
import { RsvpController } from './controllers/rsvp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Rsvp])],
  exports: [],
  providers: [RsvpService],
  controllers: [RsvpController],
})
export class RsvpModule {}
