import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/User.entity';
import { UpdateUserData } from '../types/updateUser.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Get a user by ID
  async getUserById(userId: string): Promise<User> {
    //fetch the user with related entities
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['events', 'rsvps', 'feedbacks', 'notifications'],
    });

    //if user not found:
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    //return the user with related entities
    return user;
  }

  // Update a user by ID
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserData,
  ): Promise<User> {
    //fetch the user
    const user = await this.getUserById(userId);

    //if user not found:
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    //update the user's information with the provided data
    Object.assign(user, updateUserDto);

    //save the updated user to the database
    return await this.userRepository.save(user);
  }

  // Delete a user by ID
  async deleteUser(userId: string): Promise<void> {
    //fetch the user
    const user = await this.getUserById(userId);

    //if user not found:
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    //delete the user from the database
    await this.userRepository.remove(user);
  }
}
