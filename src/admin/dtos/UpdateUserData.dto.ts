import { IsUUID, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description:
      'The role to be assigned to the user. Valid values are "Attendee" or "Organizer".',
    example: 'Organizer',
    enum: ['Attendee', 'Organizer'],
    required: false,
  })
  role?: 'Attendee' | 'Organizer';

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user whose role is being updated.',
    example: 'user@example.com',
  })
  email: string;
}
