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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Delete(':notifId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({
    name: 'notifId',
    description: 'UUID of the notification to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully.',
    type: DeleteResult,
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async deleteNotification(
    @Param('notifId', ParseUUIDPipe) notifId: string,
  ): Promise<DeleteResult> {
    return this.notificationsService.deleteNotif(notifId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully.',
    type: [Notification],
  })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user whose notifications are to be retrieved',
  })
  async getAllUserNotifications(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.findByUserId(userId);
  }
}
