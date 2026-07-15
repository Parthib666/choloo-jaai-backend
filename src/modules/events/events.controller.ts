import {
  Body,
  Controller,
  Post,
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

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

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