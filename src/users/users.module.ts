import { Module } from '@nestjs/common';
import { UserController } from './controller/users.controller';
import { UserService } from './service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
