import { IsEnum, IsUUID } from 'class-validator';

export class CreateRsvpDto {
  @IsUUID()
  eventId: string;

  @IsUUID()
  userId: string;
}
