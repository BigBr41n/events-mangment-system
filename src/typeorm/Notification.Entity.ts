import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

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
}
