import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './CreateEvent.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
