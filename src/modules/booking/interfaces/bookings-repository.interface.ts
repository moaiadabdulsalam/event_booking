import { Booking, BookingStatus, Prisma } from '@prisma/client';

export interface CreateBookingRepositoryInput {
  userId: string;
  eventId: string;
  seatId: string;
  status: BookingStatus;
  expiresAt?: Date | null;
}

export interface QueryMyBookingsRepositoryInput {
  userId: string;
  status?: BookingStatus;
}

export interface UpdateBookingRepositoryInput {
  status?: BookingStatus;
  expiresAt?: Date | null;
}

export interface IBookingRepository {
  createBooking(
    data: CreateBookingRepositoryInput,
    tx: Prisma.TransactionClient,
  ): Promise<Booking>;

  getBookingById(id: string): Promise<Booking | null>;

  getBookingBySeatId(seatId: string): Promise<Booking | null>;

  getUserBookings(query: QueryMyBookingsRepositoryInput): Promise<Booking[]>;

  updateBooking(
    id: string,
    data: UpdateBookingRepositoryInput,
  ): Promise<Booking>;

  findExpiredBookings(tx: Prisma.TransactionClient): Promise<Booking[]>;

  updateStatus(
    bookingId: string,
    status: 'EXPIRED',
    tx: Prisma.TransactionClient,
  ): Promise<void>;
}
