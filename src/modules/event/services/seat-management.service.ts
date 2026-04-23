import { Inject, Injectable } from '@nestjs/common';
import type { ISeatsManagementRepository } from '../interfaces/seat-management-repository.interface';
import { SEATS_REPOSITORY } from '../../../common/constants/injection-tokens';

@Injectable()
export class SeatManagementService {
  constructor(
    @Inject(SEATS_REPOSITORY)
    private readonly seatManagementRepository: ISeatsManagementRepository,
  ) {}


  
  async generateSeatsForEvent(
    eventId: string,
    totalSeats: number,
    prisma?: any,
  ): Promise<void> {
    const seats = Array.from({ length: totalSeats }, (_, index) => ({
      eventId,
      seatNumber: index + 1,
    }));

    await this.seatManagementRepository.createSeats(seats, prisma);
  }


  async getSeatsByEventId(eventId: string){
    return await this.seatManagementRepository.getSeatsByEventId(eventId)
  }
}
