import { Event } from '../entities/event.entity';
import { EventResponseDto } from '../dto/event-response.dto';

export class EventMapper {
  static toResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      category: event.category,
      status: event.status,
      venue: event.venue,
      address: event.address,
      city: event.city,
      eventDate: event.eventDate,
      audienceCapacity: event.audienceCapacity,
      ticketPrice: Number(event.ticketPrice),
      bannerImageUrl: event.bannerImageUrl,
      createdBy: event.createdBy.id,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}