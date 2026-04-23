import { Prisma, Seat } from '@prisma/client';

export interface createSeatManagementRepositoryInput {
  eventId: string;
  seatNumber: number;
}

export interface ISeatsManagementRepository {
  createSeats(
    data: createSeatManagementRepositoryInput[],
    prisma: any,
  ): Promise<void>;
  getSeatsByEventId(eventId: string): Promise<Seat[]>;


  reserveSeatIfAvailable(
    seatId: string,
    tx: Prisma.TransactionClient,
  ): Promise<boolean>;

  getSeatById(
    seatId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Seat | null>;



  updateSeatStatus(
    seatId: string,
    status: 'AVAILABLE',
    tx: Prisma.TransactionClient,
  ): Promise<void>;

}
