import { IsOptional, IsString, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The title of the event',
    example: 'Annual Company Meeting',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'A brief description of the event',
    example: 'A gathering to discuss the yearly performance and strategies.',
  })
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'The start date and time of the event',
    example: '2024-09-01T10:00:00Z',
  })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'The end date and time of the event',
    example: '2024-09-01T15:00:00Z',
  })
  endDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The location where the event will take place',
    example: 'Conference Room A, Headquarters Building',
  })
  location?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'The maximum number of participants allowed for the event',
    example: 100,
  })
  capacity?: number;
}
