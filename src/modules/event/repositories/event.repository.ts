import { Injectable } from '@nestjs/common';
import {
  CreateEventRepositoryInput,
  IEventRepository,
  QueryEventsRepositoryInput,
  UpdateEventRepositoryInput,
} from '../interfaces/event-repository.interface';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(
    data: CreateEventRepositoryInput,
    tx: Prisma.TransactionClient,
  ) {
    return tx.event.create({
      data,
    });
  }

  async getEventById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async getAllEvents(query?: QueryEventsRepositoryInput) {
    return this.prisma.event.findMany({
      where: {
        status: query?.status,
        ...(query?.search
          ? {
              OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { location: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip:
        query?.page && query?.limit
          ? (query.page - 1) * query.limit
          : undefined,
      take: query?.limit,
    });
  }

  async updateEvent(id: string, data: UpdateEventRepositoryInput) {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async deleteEvent(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
