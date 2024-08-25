import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe',
    required: false,
  })
  readonly username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user.',
    example: 'john.doe@example.com',
    required: false,
  })
  readonly email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The new password of the user.',
    example: 'P@ssw0rd123!',
    required: false,
  })
  readonly passwordHash?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['Admin', 'Organizer', 'Attendee'])
  @ApiProperty({
    description: 'The role of the user.',
    example: 'Organizer',
    enum: ['Admin', 'Organizer', 'Attendee'],
    required: false,
  })
  readonly role?: 'Admin' | 'Organizer' | 'Attendee';
}
