import { Injectable } from "@nestjs/common";
import { CreateBookingRepositoryInput, IBookingRepository, QueryMyBookingsRepositoryInput, UpdateBookingRepositoryInput } from "../interfaces/bookings-repository.interface";
import { Booking, Prisma } from "@prisma/client";
import { PrismaService } from "../../../database/prisma.service";


@Injectable()

export class BookingRepository implements IBookingRepository {
    constructor(private readonly prisma: PrismaService) {}


  async createBooking(
    data: CreateBookingRepositoryInput,
    tx: Prisma.TransactionClient,
  ) {
    return tx.booking.create({
      data,
    });
  }
  async getBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }

  async getBookingBySeatId(seatId: string) {
    return this.prisma.booking.findUnique({
      where: { seatId },
    });
  }

  async getUserBookings(query: QueryMyBookingsRepositoryInput) {
    return this.prisma.booking.findMany({
      where: {
        userId: query.userId,
        status: query.status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateBooking(id: string, data: UpdateBookingRepositoryInput) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }




   async findExpiredBookings(tx: Prisma.TransactionClient) {
    return tx.booking.findMany({
      where: {
        status: 'PENDING',
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async updateStatus(
    bookingId: string,
    status: 'EXPIRED',
    tx: Prisma.TransactionClient,
  ) {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
    
}