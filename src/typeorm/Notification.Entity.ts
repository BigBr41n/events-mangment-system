import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './User.entity';
import { Event } from './Event.entity';

@Entity('notifications')
@Index('IDX_NOTIFICATIONS_USER_ID', ['userId'])
@Index('IDX_NOTIFICATIONS_EVENT_ID', ['eventId'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({ type: 'enum', enum: ['Reminder', 'Update'] })
  type: 'Reminder' | 'Update';

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'timestamp' })
  sentAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Event, (event) => event.notifications)
  event: Event;
}
