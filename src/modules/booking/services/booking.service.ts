import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IBookingRepository } from '../interfaces/bookings-repository.interface';
import {
  BOOKINGS_REPOSITORY,
  SEATS_REPOSITORY,
  UNIT_OF_WORK,
} from '../../../common/constants/injection-tokens';
import type { ISeatsManagementRepository } from '../../event/interfaces/seat-management-repository.interface';
import { EventService } from '../../event/services/event.service';
import { UserService } from '../../user/services/user.service';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { BookingStatus, SeatStatus } from '@prisma/client';
import { QueryMyBookingsDto } from '../dtos/query-my-bookings.dto';
import type { IUnitOfWork } from '../../event/interfaces/unit-of-work.interface';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKINGS_REPOSITORY)
    private readonly bookingsRepository: IBookingRepository,

    @Inject(SEATS_REPOSITORY)
    private readonly seatsRepository: ISeatsManagementRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    private readonly usersService: UserService,
    private readonly eventsService: EventService,
  ) {}

  private async ensureBookingExists(id: string) {
    const booking = await this.bookingsRepository.getBookingById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    await this.usersService.getUserById(userId);
    const event = await this.eventsService.getEventById(dto.eventId);

    return this.unitOfWork.execute(async (tx) => {
      const seat = await this.seatsRepository.getSeatById(dto.seatId, tx);

      if (!seat || seat.eventId !== dto.eventId) {
        throw new NotFoundException('Seat not found');
      }

      const reserved = await this.seatsRepository.reserveSeatIfAvailable(
        dto.seatId,
        tx,
      );

      if (!reserved) {
        throw new BadRequestException('Seat already booked');
      }

      const booking = await this.bookingsRepository.createBooking(
        {
          userId,
          eventId: event.id,
          seatId: dto.seatId,
          status: BookingStatus.PENDING,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        tx,
      );

      return booking;
    });
  }

  async getMyBookings(userId: string, Query: QueryMyBookingsDto) {
    await this.usersService.getUserById(userId);
    return this.bookingsRepository.getUserBookings({
      userId,
      status: Query.status,
    });
  }

  async getBookingById(id: string) {
    return this.ensureBookingExists(id);
  }

  async cancelBooking(id: string) {
    const booking = await this.ensureBookingExists(id);
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Confirmed booking cancellation flow will be handled separately',
      );
    }

    return this.bookingsRepository.updateBooking(id, {
      status: BookingStatus.CANCELLED,
    });
  }
}
