// src/modules/auth/services/password-reset.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OTP_SERVICE,
  PASSWORD_SERVICE,
  REFRESH_TOKEN_SERVICE,
} from '../../../common/constants/injection-tokens';
import type{ IOtpService } from '../interfaces/otp-service.interface';
import type { IPasswordResetService } from '../interfaces/password-reset-service.interface';
import type { IPasswordService } from '../interfaces/password-service.interface';
import type { IRefreshTokenService } from '../interfaces/refresh-token-service.interface';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    private readonly usersService: UserService,

    @Inject(OTP_SERVICE)
    private readonly otpService: IOtpService,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,

    @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {}

  async requestReset(email: string): Promise<{ message: string; code: string }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await this.otpService.create(user.id, 'PASSWORD_RESET');

    return {
      message: 'OTP sent successfully',
      code, // demo only
    };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.otpService.verify(
      user.id,
      code,
      'PASSWORD_RESET',
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const passwordHash = await this.passwordService.hash(newPassword);

    await this.usersService.updateUser(user.id, {
      passwordHash,
    });

    await this.refreshTokenService.revoke(user.id);

    return {
      message: 'Password reset successfully',
    };
  }
}