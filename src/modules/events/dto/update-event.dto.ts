import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../enums/event-status.enum';

export class UpdateEventDto extends PartialType(
  OmitType(CreateEventDto, ['category'] as const),
) {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}