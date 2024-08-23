import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsInt()
  rating: number;
}
