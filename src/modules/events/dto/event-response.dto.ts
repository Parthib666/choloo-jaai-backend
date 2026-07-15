import { EventCategory } from '../enums/event-category.enum';
import { EventStatus } from '../enums/event-status.enum';

export class EventResponseDto {
  id: string;

  title: string;

  slug: string;

  description: string;

  category: EventCategory;

  status: EventStatus;

  venue: string;

  address?: string;

  city: string;

  eventDate: Date;

  audienceCapacity: number;

  ticketPrice: number;

  bannerImageUrl?: string;

  createdBy: string;

  createdAt: Date;

  updatedAt: Date;
}