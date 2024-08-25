import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user. Must be a valid email format.',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The username for the user.',
    example: 'john_doe',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @ApiProperty({
    description: 'The password for the user. Must be a strong password.',
    example: 'P@ssw0rd123!',
  })
  password: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description:
      'The role assigned to the user. Valid values are "Organizer" or "Attendee".',
    example: 'Organizer',
    enum: ['Organizer', 'Attendee'],
  })
  role: 'Organizer' | 'Attendee';
}
