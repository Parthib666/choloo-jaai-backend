import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventMapper } from './mappers/event.mapper';

import { generateSlug } from '../../common/utils/slug.util';
import { GetEventsQueryDto } from './dto/get-events-query.dto';

import { SelectQueryBuilder } from 'typeorm';
import { EventStatus } from './enums/event-status.enum';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = generateSlug(title);

    let slug = baseSlug;
    let counter = 2;

    while (
      await this.eventRepository.exists({
        where: { slug },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async createEvent(
    createEventDto: CreateEventDto,
    currentUser: JwtPayload,
  ): Promise<EventResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const slug = await this.generateUniqueSlug(createEventDto.title);

    const event = this.eventRepository.create({
      ...createEventDto,
      slug,
      createdBy: user,
    });

    const savedEvent = await this.eventRepository.save(event);

    const createdEvent = await this.eventRepository.findOne({
      where: {
        id: savedEvent.id,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!createdEvent) {
      throw new NotFoundException('Event not found.');
    }

    return EventMapper.toResponseDto(createdEvent);
  }

  async findAll(
    query: GetEventsQueryDto,
    includeUnpublished = false,
  ) {
    const {
      search,
      category,
      city,
      date,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'createdBy');

    if (!includeUnpublished) {
      queryBuilder.andWhere('event.status = :status', {
        status: EventStatus.PUBLISHED,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    if (category) {
      queryBuilder.andWhere('event.category = :category', {
        category,
      });
    }

    if (city) {
      queryBuilder.andWhere('LOWER(event.city) = LOWER(:city)', {
        city,
      });
    }

    if (date) {
      queryBuilder.andWhere(
        'event.eventDate >= :startDate AND event.eventDate < :endDate',
        {
          startDate: `${date} 00:00:00`,
          endDate: `${date} 23:59:59`,
        },
      );
    }

    queryBuilder
      .orderBy(`event.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      data: events.map(EventMapper.toResponseDto),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(
    slug: string,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { slug },
      relations: {
        createdBy: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return EventMapper.toResponseDto(event);
  }

  async findOne(
    id: string,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return EventMapper.toResponseDto(event);
  }

  //update event
  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }
    if (
      updateEventDto.title &&
      updateEventDto.title !== event.title
    ) {
      event.slug = await this.generateUniqueSlug(
        updateEventDto.title,
      );
    }
    Object.assign(event, updateEventDto);

    const updatedEvent = await this.eventRepository.save(event);

    return EventMapper.toResponseDto(updatedEvent);
  }

  //delete event
  async deleteEvent(
  id: string,
) {
  const event = await this.eventRepository.findOne({
    where: { id },
  });

  if (!event) {
    throw new NotFoundException('Event not found.');
  }

  if (event.status === EventStatus.PUBLISHED) {
  throw new ForbiddenException(
    'Published events cannot be deleted. Cancel the event instead.',
  );
}

await this.eventRepository.softRemove(event);

return {
  message: 'Event deleted successfully.',
};
}
}