import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('rsvps')
@Index('IDX_RSVPS_EVENT_ID', ['eventId'])
@Index('IDX_RSVPS_USER_ID', ['userId'])
export class Rsvp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: ['Confirmed', 'Declined', 'Pending'] })
  status: 'Confirmed' | 'Declined' | 'Pending';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
