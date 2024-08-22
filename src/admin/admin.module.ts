import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admins.controller';
import { AdminService } from './services/admins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../typeorm/Event.entity';
import { User } from '../typeorm/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
