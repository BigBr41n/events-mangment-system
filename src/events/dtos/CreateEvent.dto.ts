import { IsNotEmpty, IsString, IsDate, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
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
  capacity: number;
}
