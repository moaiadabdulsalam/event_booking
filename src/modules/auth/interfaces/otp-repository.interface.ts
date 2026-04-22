import { Otp } from '@prisma/client';

export interface CreateOtpRepositoryInput {
  userId: string;
  codeHash: string;
  purpose: string;
  expiresAt: Date;
}

export interface IOtpRepository {
  invalidateActiveOtps(userId: string, purpose: string): Promise<void>;
  findActiveOtps(userId: string, purpose: string): Promise<Otp[]>;
  createOtp(data: CreateOtpRepositoryInput): Promise<Otp>;
  markOtpAsUsed(id: string): Promise<Otp>;
}
