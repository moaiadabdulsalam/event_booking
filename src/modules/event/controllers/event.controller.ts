// src/modules/events/controllers/events.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateEventDto } from '../dto/create-event.dto';

import { UpdateEventDto } from '../dto/update-event.dto';
import { EventService } from '../services/event.service';
import { QueryEventsDto } from '../dto/query-event.dto';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/roles.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  getAllEvents(@Query() query: QueryEventsDto) {
    return this.eventsService.getAllEvents(query);
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Get(':id/seats')
  getEventSeats(@Param('id') id: string) {
    return this.eventsService.getEventSeats(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.createEvent(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/publish')
  publishEvent(@Param('id') id: string) {
    return this.eventsService.publishEvent(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/close')
  closeEvent(@Param('id') id: string) {
    return this.eventsService.closeEvent(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/cancel')
  cancelEvent(@Param('id') id: string) {
    return this.eventsService.cancelEvent(id);
  }
}