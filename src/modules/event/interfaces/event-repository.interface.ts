import { EventStatus, Prisma, Event } from '@prisma/client';

export interface CreateEventRepositoryInput {
  title: string;
  description?: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  totalSeats: number;
  availableSeats: number;
  price: Prisma.Decimal;
  createdById: string;
}

export interface UpdateEventRepositoryInput {
  title?: string;
  description?: string;
  location?: string;
  startsAt?: Date;
  endsAt?: Date;
  totalSeats?: number;
  status?: EventStatus;
  availableSeats?: number;
  price?: Prisma.Decimal;
  createdById?: string;
}

export interface QueryEventsRepositoryInput {
  status?: EventStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IEventRepository {
  createEvent(data: CreateEventRepositoryInput, prisma: any): Promise<Event>;
  updateEvent(id: string, data: UpdateEventRepositoryInput): Promise<Event>;
  deleteEvent(id: string): Promise<Event>;
  getEventById(id: string): Promise<Event | null>;
  getAllEvents(query?: QueryEventsRepositoryInput): Promise<Event[]>;
}
