import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventMapper } from './mappers/event.mapper';

import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
}