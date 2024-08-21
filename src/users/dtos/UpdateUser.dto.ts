import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly passwordHash?: string;

  @IsOptional()
  @IsString()
  readonly role?: 'Admin' | 'Organizer' | 'Attendee';
}
