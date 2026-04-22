// src/modules/auth/repositories/otp.repository.ts
import { Injectable } from '@nestjs/common';
import {
  CreateOtpRepositoryInput,
  IOtpRepository,
} from '../interfaces/otp-repository.interface';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}


  async invalidateActiveOtps(userId: string, purpose: string): Promise<void> {
    await this.prisma.otp.updateMany({
      where: {
        userId,
        purpose,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

   async findActiveOtps(userId: string, purpose: string) {
    return this.prisma.otp.findMany({
      where: {
        userId,
        purpose,
        usedAt: null,
      },
    });
  }

  async createOtp(data: CreateOtpRepositoryInput) {
    return this.prisma.otp.create({
      data,
    });
  }

  async markOtpAsUsed(id: string) {
    return this.prisma.otp.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}