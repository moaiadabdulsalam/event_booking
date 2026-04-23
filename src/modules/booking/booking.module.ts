import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/bookings.repository';
import { BOOKINGS_REPOSITORY } from '../../common/constants/injection-tokens';
import { EventModule } from '../event/event.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { BookingExpireService } from './jobs/booking-expire.service';
import { LogsModule } from '../logs/logs.module';
import { AppLogger } from '../../common/logger/app-logger.service';

@Module({
  imports: [EventModule, AuthModule, UserModule ,LogsModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: BOOKINGS_REPOSITORY,
      useClass: BookingRepository,
    },
    BookingExpireService,
    AppLogger
  ],
})
export class BookingModule {}
