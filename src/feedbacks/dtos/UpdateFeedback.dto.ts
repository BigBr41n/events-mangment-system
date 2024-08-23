import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from './CreateFeedback.dto';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
