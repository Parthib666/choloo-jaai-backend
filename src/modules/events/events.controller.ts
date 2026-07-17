import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';


import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { UserRole } from '../users/enums/user-role.enum';

import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { GetEventsQueryDto } from './dto/get-events-query.dto';

import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) { }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Query() query: GetEventsQueryDto,
    @CurrentUser() currentUser: JwtPayload | null,
  ) {
    const includeUnpublished =
      currentUser?.role === UserRole.ADMIN ||
      currentUser?.role === UserRole.EVENT_MANAGER;

    return this.eventsService.findAll(
      query,
      includeUnpublished,
    );
  }

  @Get('slug/:slug')
  findBySlug(
    @Param('slug') slug: string,
  ) {
    return this.eventsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EVENT_MANAGER)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.eventsService.createEvent(
      createEventDto,
      currentUser,
    );
  }
}