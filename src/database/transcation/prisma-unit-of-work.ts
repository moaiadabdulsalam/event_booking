import { Injectable } from '@nestjs/common';
import { IUnitOfWork } from '../../modules/event/interfaces/unit-of-work.interface';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';


//open transaction
@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }
}
