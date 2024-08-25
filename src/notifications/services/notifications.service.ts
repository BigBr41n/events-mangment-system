import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Notification } from '../../typeorm/Notification.Entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  //create a notification
  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return this.notificationRepository.save(notification);
  }

  //find all notifications of a user
  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { userId } });
  }

  //delete a notification by it's own id
  async deleteNotif(notifId: string): Promise<DeleteResult> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notifId },
    });
    return this.notificationRepository.delete(notification);
  }
}
