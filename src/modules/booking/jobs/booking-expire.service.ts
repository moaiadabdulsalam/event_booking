// booking-expire.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { ISeatsManagementRepository } from '../../event/interfaces/seat-management-repository.interface';
import * as unitOfWorkInterface from '../../event/interfaces/unit-of-work.interface';
import {
  BOOKINGS_REPOSITORY,
  SEATS_REPOSITORY,
  UNIT_OF_WORK,
} from '../../../common/constants/injection-tokens';
import type { IBookingRepository } from '../interfaces/bookings-repository.interface';
import type { IUnitOfWork } from '../../event/interfaces/unit-of-work.interface';

@Injectable()
export class BookingExpireService {
  private readonly logger = new Logger(BookingExpireService.name);

  constructor(
    @Inject(BOOKINGS_REPOSITORY)
    private readonly bookingsRepository: IBookingRepository,

    @Inject(SEATS_REPOSITORY)
    private readonly seatsRepository: ISeatsManagementRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  @Cron('*/30 * * * * *')
  async handleExpiredBookings() {
    this.logger.log('Checking for expired bookings...');

    await this.unitOfWork.execute(async (tx) => {
      const expiredBookings =
        await this.bookingsRepository.findExpiredBookings(tx);

      if (!expiredBookings.length) return;

      for (const booking of expiredBookings) {
        await this.bookingsRepository.updateStatus(booking.id, 'EXPIRED', tx);

        await this.seatsRepository.updateSeatStatus(
          booking.seatId,
          'AVAILABLE',
          tx,
        );

        this.logger.log(`Expired booking: ${booking.id}`);
      }
    });
  }
}
