import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { NotificationsService } from '../services/notifications.service';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { Notification } from '../../typeorm/Notification.Entity';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Delete(':notifId')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(
    @Param('notifId', ParseUUIDPipe) notifId: string,
  ): Promise<DeleteResult> {
    return this.notificationsService.deleteNotif(notifId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUserNotifications(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.findByUserId(userId);
  }
}
