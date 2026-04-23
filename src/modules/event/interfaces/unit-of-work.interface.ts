import { Prisma } from "@prisma/client";

export interface IUnitOfWork {
  execute<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
