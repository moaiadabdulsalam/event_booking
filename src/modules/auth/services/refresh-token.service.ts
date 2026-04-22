// src/modules/auth/services/refresh-token.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../../common/constants/injection-tokens';
import type { IPasswordService } from '../interfaces/password-service.interface';
import {
  IRefreshTokenService,
  TokenPair,
} from '../interfaces/refresh-token-service.interface';
import type { ITokenService } from '../interfaces/token-service.interface';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly usersService: UserService,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async issueTokens(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    const hashedRefreshToken = await this.passwordService.hash(refreshToken);

    await this.usersService.updateUser(user.id, {
      hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.usersService.getUserById(payload.sub);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await this.passwordService.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async revoke(userId: string): Promise<void> {
    await this.usersService.updateUser(userId, {
      hashedRefreshToken: null,
    });
  }
}
