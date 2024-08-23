import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from './admins.service';
import { Event } from '../../typeorm/Event.entity';
import { User } from '../../typeorm/User.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { UpdateUserRoleDto } from '../dtos/UpdateUserData.dto';

describe('AdminService', () => {
  let service: AdminService;
  let eventRepository: Repository<Event>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllEvents', () => {
    it('should return an array of events', async () => {
      const events: Event[] = [{ id: '1', title: 'Event 1' } as Event];
      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      const result = await service.findAllEvents();
      expect(result).toEqual(events);
    });
  });

  describe('updateEventById', () => {
    it('should update and return the event', async () => {
      const eventId = '1';
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const event = { id: eventId, title: 'Original Event' } as Event;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'merge').mockReturnValue({
        ...event,
        ...updateEventDto,
      });
      jest.spyOn(eventRepository, 'save').mockResolvedValue({
        ...event,
        ...updateEventDto,
      });

      const result = await service.updateEventById(eventId, updateEventDto);
      expect(result).toEqual({ ...event, ...updateEventDto });
    });

    it('should throw NotFoundException if event is not found', async () => {
      const eventId = '1';
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateEventById(eventId, updateEventDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllUsersByRole', () => {
    it('should return an array of users by role', async () => {
      const users: User[] = [{ id: '1', role: 'Attendee' } as User];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAllUsersByRole('Attendee');
      expect(result).toEqual(users);
    });
  });

  describe('findAllUsersByEmail', () => {
    it('should return an array of users by email', async () => {
      const users: User[] = [{ id: '1', email: 'test@example.com' } as User];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAllUsersByEmail('test@example.com');
      expect(result).toEqual(users);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [{ id: '1', email: 'test@example.com' } as User];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('updateUserRoleByEmail', () => {
    it('should update and return the user', async () => {
      const updateUserRoleDto: UpdateUserRoleDto = {
        email: 'test@example.com',
        role: 'Organizer',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'Attendee',
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...user,
        role: updateUserRoleDto.role,
      });

      const result = await service.updateUserRoleByEmail(updateUserRoleDto);
      expect(result).toEqual({ ...user, role: updateUserRoleDto.role });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserRoleDto: UpdateUserRoleDto = {
        email: 'test@example.com',
        role: 'Organizer',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateUserRoleByEmail(updateUserRoleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
