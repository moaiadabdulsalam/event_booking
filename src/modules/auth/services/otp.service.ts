import { Inject, Injectable } from '@nestjs/common';
import type { IOtpRepository } from '../interfaces/otp-repository.interface';
import { IOtpService } from '../interfaces/otp-service.interface';
import type { IPasswordService } from '../interfaces/password-service.interface';
import { OTP_REPOSITORY, PASSWORD_SERVICE } from '../../../common/constants/injection-tokens';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 90000).toString();
  }


  async create(userId: string, purpose: string): Promise<string> {
    await this.otpRepository.invalidateActiveOtps(userId, purpose);
    const code = this.generateOtp();
    const codeHash = await this.passwordService.hash(code);
    await this.otpRepository.createOtp({
      userId,
      purpose,
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    return code;
  }

  async verify(
    userId: string,
    purpose: string,
    code: string,
  ): Promise<boolean> {
    const records = await this.otpRepository.findActiveOtps(userId, purpose);

    for (const record of records) {
      if (record.expiresAt <= new Date()) {
        continue;
      }

      const isMatch = await this.passwordService.compare(code, record.codeHash);

      if (isMatch) {
        await this.otpRepository.markOtpAsUsed(record.id);
        return true;
      }
    }

    return false;
  }
}
