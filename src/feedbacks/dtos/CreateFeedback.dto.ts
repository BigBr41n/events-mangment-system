import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The feedback comment provided by the user.',
    example: 'Great event! The sessions were very informative.',
  })
  comment: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description:
      'The rating given by the user for the event. Should be an integer value, e.g., 1 to 5.',
    example: 4,
  })
  rating: number;
}
