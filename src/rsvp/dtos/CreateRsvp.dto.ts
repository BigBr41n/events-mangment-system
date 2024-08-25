import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRsvpDto {
  @IsUUID()
  @ApiProperty({
    description: 'The UUID of the event the user is RSVPing to.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  eventId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The UUID of the user making the RSVP.',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;
}
