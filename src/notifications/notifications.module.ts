import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User.entity';
import { Event } from '../typeorm/Event.entity';
import { Notification } from '../typeorm/Notification.Entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event, Notification]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7h' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NotificationsGateway],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
