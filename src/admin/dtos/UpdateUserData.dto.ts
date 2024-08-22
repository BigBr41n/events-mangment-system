import { IsUUID, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsUUID()
  role?: 'Attendee' | 'Organizer';

  @IsEmail()
  email: string;
}
