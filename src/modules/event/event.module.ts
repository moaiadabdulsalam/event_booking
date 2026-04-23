import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { SeatManagementService } from './services/seat-management.service';
import {
  EVENTS_REPOSITORY,
  SEATS_REPOSITORY,
  UNIT_OF_WORK,
} from '../../common/constants/injection-tokens';
import { SeatManagementRepository } from './repositories/seat-mangement.repository';
import { EventController } from './controllers/event.controller';
import { EventRepository } from './repositories/event.repository';
import { PrismaUnitOfWork } from '../../database/transcation/prisma-unit-of-work';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule],
  providers: [
    EventService,
    SeatManagementService,
    {
      provide: SEATS_REPOSITORY,
      useClass: SeatManagementRepository,
    },
    {
      provide: EVENTS_REPOSITORY,
      useClass: EventRepository,
    },
    EventRepository,
    SeatManagementRepository,
  ],
  controllers: [EventController],
  exports: [
    EventService,
    SeatManagementService,
    SEATS_REPOSITORY
  ],
})
export class EventModule {}
