import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './User.entity';
import { Event } from './Event.entity';

@Entity('feedback')
@Index('IDX_FEEDBACK_EVENT_ID', ['eventId'])
@Index('IDX_FEEDBACK_USER_ID', ['userId'])
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Event, (event) => event.feedbacks)
  event: Event;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;
}
