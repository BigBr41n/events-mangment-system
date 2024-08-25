import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../../typeorm/User.entity';
import { Notification } from '../../typeorm/Notification.Entity';
import { Repository } from 'typeorm';
import { NotificationsService } from '../services/notifications.service';

@Injectable()
@WebSocketGateway({
  cors: '*',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly notificationService: NotificationsService,
  ) {}

  @WebSocketServer() server: Server;

  //map the current user with the current socket client
  private userSockets: Map<string, string> = new Map();

  // handel the connection and authenticate the user using jwt
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    //grab the token sent from the client
    //as : const socket = io('http://localhost:3000', { query: { token } });
    const token = client.handshake.query.token as string;

    //check if the token exists
    if (!token) {
      client.disconnect(true);
    }
    //validate the token
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      //join the user to a room to get his own notifications only not a broadcast
      await client.join(`user_${userId}`);

      //save the user's socket id in the map
      this.userSockets.set(userId, client.id);
    } catch (error) {
      client.emit('error', 'Authentication error: Invalid token');
      console.error('Error validating token:', error);
      return client.disconnect(true);
    }
  }

  // remove the user from the map when disconnected
  handleDisconnect(client: Socket) {
    const userId = this.getUserIdBySocketId(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  // get the userIf by the socketId
  getUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, id] of this.userSockets.entries()) {
      if (id === socketId) return userId;
    }
    return undefined;
  }

  async sendNotification(
    userId: string,
    eventId: string,
    message: string,
    type: 'Reminder' | 'Update',
  ) {
    //create a new notification and save it to the database
    const notificationData = {
      userId,
      message,
      isRead: false,
      type,
      eventId,
      sentAt: new Date(),
    };

    //create the notification in the database
    await this.notificationService.create(notificationData);

    //check if the user is connected now
    if (this.userSockets.has(userId)) {
      // User is online, send real-time notification
      this.server.to(`user_${userId}`).emit('notification', message);
    }
    // If user is offline, notification is already stored in the database
  }
}
