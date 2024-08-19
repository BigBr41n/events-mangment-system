import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User.entity';
import { Rsvp } from './Rsvp.entity';
import { Feedback } from './Feedback.entity';
import { Notification } from './Notification.Entity';

@Entity('events')
@Index('IDX_EVENTS_ORGANIZER_ID', ['organizerId'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'uuid' })
  organizerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.events)
  organizer: User;

  @OneToMany(() => Rsvp, (rsvp) => rsvp.event)
  rsvps: Rsvp[];

  @OneToMany(() => Feedback, (feedback) => feedback.event)
  feedbacks: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.event)
  notifications: Notification[];
}
