import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { User } from './typeorm/User.entity';
import { Event } from './typeorm/Event.entity';
import { Feedback } from './typeorm/Feedback.entity';
import { Notification } from './typeorm/Notification.Entity';
import { Rsvp } from './typeorm/Rsvp.entity';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AdminModule } from './admin/admin.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development.local',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Event, Feedback, Notification, Rsvp],
        synchronize: true,
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    AdminModule,
    RsvpModule,
    FeedbacksModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
