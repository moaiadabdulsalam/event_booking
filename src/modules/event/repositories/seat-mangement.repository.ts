import { Injectable } from '@nestjs/common';
import {
  createSeatManagementRepositoryInput,
  ISeatsManagementRepository,
} from '../interfaces/seat-management-repository.interface';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Seat } from '@prisma/client';

@Injectable()
export class SeatManagementRepository implements ISeatsManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSeats(
    data: createSeatManagementRepositoryInput[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.seat.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async getSeatsByEventId(eventId: string): Promise<Seat[]> {
    return await this.prisma.seat.findMany({
      where: {
        eventId,
      },
    });
  }
  async reserveSeatIfAvailable(
    seatId: string,
    tx: Prisma.TransactionClient,
  ): Promise<boolean> {
    const result = await tx.seat.updateMany({
      where: {
        id: seatId,
        status: 'AVAILABLE',
      },
      data: {
        status: 'RESERVED',
      },
    });

    return result.count === 1;
  }

  async getSeatById(seatId: string, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prisma;

    return db.seat.findUnique({
      where: { id: seatId },
    });
  }

  async updateSeatStatus(
    seatId: string,
    status: 'AVAILABLE',
    tx: Prisma.TransactionClient,
  ) {
    await tx.seat.update({
      where: { id: seatId },
      data: { status },
    });
  }
}
