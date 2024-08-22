import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/Event.entity';
import { User } from '../../typeorm/User.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { UpdateUserRoleDto } from '../dtos/UpdateUserData.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async updateEventById(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const updatedEvent = this.eventRepository.merge(event, updateEventDto);
    return this.eventRepository.save(updatedEvent);
  }

  async findAllUsersByRole(role: 'Attendee' | 'Organizer'): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  async findAllUsersByEmail(email: string): Promise<User[]> {
    return this.userRepository.find({ where: { email } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUserRoleByEmail(updateUserDto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (!user) {
      throw new NotFoundException(
        `User with email ${updateUserDto.email} not found`,
      );
    }

    user.role = updateUserDto.role;
    return this.userRepository.save(user);
  }
}
