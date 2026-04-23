// src/modules/events/services/events.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import {
  EVENTS_REPOSITORY,
  UNIT_OF_WORK,
} from '../../../common/constants/injection-tokens';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { SeatManagementService } from './seat-management.service';
import type { IEventRepository } from '../interfaces/event-repository.interface';
import { QueryEventsDto } from '../dto/query-event.dto';
import type { IUnitOfWork } from '../interfaces/unit-of-work.interface';
import { AppLogger } from '../../../common/logger/app-logger.service';
import { LogService } from '../../logs/services/log.service';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: IEventRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    private readonly seatManagementService: SeatManagementService,

    private readonly logService: AppLogger,

    private readonly lgCreated : LogService
    
  ) {}

  private async ensureEventExists(id: string) {
    const event = await this.eventsRepository.getEventById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  private validateDates(startsAt: Date, endsAt: Date): void {
    if (endsAt <= startsAt) {
      throw new BadRequestException('Event end date must be after start date');
    }
  }

  async createEvent(dto: CreateEventDto, createdById: string) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    this.validateDates(startsAt, endsAt);

    return this.unitOfWork.execute(async (tx) => {
      const event = await this.eventsRepository.createEvent(
        {
          title: dto.title,
          description: dto.description,
          location: dto.location,
          startsAt,
          endsAt,
          totalSeats: dto.totalSeats,
          availableSeats: dto.totalSeats,
          price: Prisma.Decimal(dto.price),
          createdById,
        },
        tx,
      );

      await this.seatManagementService.generateSeatsForEvent(
        event.id,
        dto.totalSeats,
        tx,
      );

      this.logService.log(
        `New event created: ${event.title} (ID: ${event.id}) by user: ${createdById}`,
      );

      await this.lgCreated.createLog('Event Created', { eventId: event.id, createdById }, createdById);
      return event;
    });
  }

  async getEventById(id: string) {
    return this.ensureEventExists(id);
  }

  async getAllEvents(query?: QueryEventsDto) {
    return this.eventsRepository.getAllEvents(query);
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const event = await this.ensureEventExists(id);

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : event.startsAt;
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : event.endsAt;

    this.validateDates(startsAt, endsAt);

    if (
      dto.totalSeats &&
      dto.totalSeats < event.totalSeats - event.availableSeats
    ) {
      this.logService.warn(
        `Failed to update event: ${event.title} (ID: ${event.id}). Reason: Total seats cannot be less than already booked seats.`,
      );
      throw new BadRequestException(
        'Total seats cannot be less than already booked seats',
      );
    }
    this.logService.log(`Event updated: ${event.title} (ID: ${event.id})`);
    await this.lgCreated.createLog('Event Updated', { eventId: event.id, updatedById: event.createdById }, event.createdById);
    return this.eventsRepository.updateEvent(id, {
      title: dto.title,
      description: dto.description,
      location: dto.location,
      startsAt,
      endsAt,
      totalSeats: dto.totalSeats,
      price: dto.price ? Prisma.Decimal(dto.price) : undefined,
    });
  }

  async deleteEvent(id: string) {
    const event = await this.ensureEventExists(id);
    this.logService.log(`Event deleted: ${event.title} (ID: ${event.id})`);
    return this.eventsRepository.deleteEvent(id);
  }

  async publishEvent(id: string) {
    await this.ensureEventExists(id);
    this.logService.log(`Event published: (ID: ${id})`);
    return this.eventsRepository.updateEvent(id, {
      status: EventStatus.PUBLISHED,
    });
  }

  async closeEvent(id: string) {
    await this.ensureEventExists(id);
    this.logService.log(`Event closed: (ID: ${id})`);
    return this.eventsRepository.updateEvent(id, {
      status: EventStatus.CLOSED,
    });
  }

  async cancelEvent(id: string) {
    await this.ensureEventExists(id);
    this.logService.log(`Event cancelled: (ID: ${id})`);
    return this.eventsRepository.updateEvent(id, {
      status: EventStatus.CANCELLED,
    });
  }

  async getEventSeats(id: string) {
    await this.ensureEventExists(id);
    return this.seatManagementService.getSeatsByEventId(id);
  }
}
