import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admins.controller';
import { AdminService } from '../services/admins.service';
import { Event } from '../../typeorm/Event.entity';
import { User } from '../../typeorm/User.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { UpdateUserRoleDto } from '../dtos/UpdateUserData.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard.guard';
import { RoleGuard } from '../../common/guards/Role.guard';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            findAllEvents: jest.fn(),
            updateEventById: jest.fn(),
            findAllUsers: jest.fn(),
            updateUserRoleByEmail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    adminController = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const result: Event[] = [{} as Event];
      jest.spyOn(adminService, 'findAllEvents').mockResolvedValue(result);

      expect(await adminController.getAllEvents()).toBe(result);
      expect(adminService.findAllEvents).toHaveBeenCalled();
    });
  });

  describe('updateEvent', () => {
    it('should return an updated event', async () => {
      const eventId = '1';
      const updateEventDto: UpdateEventDto = {};
      const result: Event = {} as Event;

      jest.spyOn(adminService, 'updateEventById').mockResolvedValue(result);

      expect(await adminController.updateEvent(eventId, updateEventDto)).toBe(
        result,
      );
      expect(adminService.updateEventById).toHaveBeenCalledWith(
        eventId,
        updateEventDto,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ id: '1', email: 'test@example.com' } as User];
      jest.spyOn(adminService, 'findAllUsers').mockResolvedValue(result);

      expect(await adminController.getAllUsers()).toBe(result);
      expect(adminService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('should return an updated user', async () => {
      const userId = '1';
      const updateUserRoleDto: UpdateUserRoleDto = {
        email: 'test@example.com',
        role: 'Organizer',
      };
      const result: User = {
        id: '1',
        email: 'test@example.com',
        role: 'Organizer',
      } as User;

      jest
        .spyOn(adminService, 'updateUserRoleByEmail')
        .mockResolvedValue(result);

      expect(
        await adminController.updateUserRole(userId, updateUserRoleDto),
      ).toBe(result);
      expect(adminService.updateUserRoleByEmail).toHaveBeenCalledWith(
        updateUserRoleDto,
      );
    });
  });
});
