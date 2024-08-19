import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Event } from './Event.entity';
import { Rsvp } from './Rsvp.entity';
import { Feedback } from './Feedback.entity';
import { Notification } from './Notification.Entity';

@Entity('users')
@Index('IDX_USERS_EMAIL', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: ['Admin', 'Organizer', 'Attendee'] })
  role: 'Admin' | 'Organizer' | 'Attendee';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => Rsvp, (rsvp) => rsvp.user)
  rsvps: Rsvp[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
