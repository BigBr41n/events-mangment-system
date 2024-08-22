import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admins.service';

describe('ServiceService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = module.get(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
