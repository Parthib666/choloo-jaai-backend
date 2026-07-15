import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  IsNumber,
  IsUrl,
  Min,
} from 'class-validator';

import { EventCategory } from '../enums/event-category.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsDateString()
  eventDate: Date;

  @IsInt()
  @Min(1)
  audienceCapacity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ticketPrice?: number;

  @IsOptional()
  @IsUrl()
  bannerImageUrl?: string;
}