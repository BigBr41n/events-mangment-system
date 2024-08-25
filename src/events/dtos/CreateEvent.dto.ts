import { IsNotEmpty, IsString, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The title of the event.',
    example: 'Tech Conference 2024',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'A detailed description of the event.',
    example:
      'An annual conference for tech enthusiasts to explore the latest innovations.',
  })
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The start date and time of the event.',
    example: '2024-06-15T09:00:00Z',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The end date and time of the event.',
    example: '2024-06-15T17:00:00Z',
  })
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The location where the event will be held.',
    example: 'Convention Center, San Francisco, CA',
  })
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'The category of the event. Valid values include Tech, Culture, Art, Business, Education, Sports, Music, Health.',
    example: 'Tech',
    enum: [
      'Tech',
      'Culture',
      'Art',
      'Business',
      'Education',
      'Sports',
      'Music',
      'Health',
    ],
  })
  category:
    | 'Tech'
    | 'Culture'
    | 'Art'
    | 'Business'
    | 'Education'
    | 'Sports'
    | 'Music'
    | 'Health';

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The maximum number of attendees allowed for the event.',
    example: 250,
  })
  capacity: number;
}
