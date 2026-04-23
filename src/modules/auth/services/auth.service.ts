import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { registerDto } from '../dto/register.dto';
import { UserService } from '../../user/services/user.service';
import {
  PASSWORD_SERVICE,
  REFRESH_TOKEN_SERVICE,
  TOKEN_SERVICE,
} from '../../../common/constants/injection-tokens';
import type { IPasswordService } from '../interfaces/password-service.interface';
import { Role } from '../../../../generated/prisma/enums';
import type { ITokenService } from '../interfaces/token-service.interface';
import { LoginDto } from '../dto/login.dto';
import type { IRefreshTokenService } from '../interfaces/refresh-token-service.interface';
import { LogService } from '../../logs/services/log.service';
import { AppLogger } from '../../../common/logger/app-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,

     @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: IRefreshTokenService,

    private readonly logService : AppLogger
  ) {}

  async register(data: registerDto) {
    const existingUser = await this.userService.getUserByEmail(data.email);
    if (existingUser) {
      this.logService.warn(`Registration attempt with existing email: ${data.email}`);
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await this.passwordService.hash(data.password);
    const user = await this.userService.createUser({
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: Role.USER,
      isActive: true,
    });

    const tokens = await this.refreshTokenService.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    this.logService.log(`New user registered: ${user.email} (ID: ${user.id})`);
    return {
      user,
      ...tokens,
    };
   
  }

  async login(data: LoginDto) {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      this.logService.warn(`Login attempt with non-existing email: ${data.email}`);
      throw new BadRequestException('Email not found');
    }

    const isValidPassword = await this.passwordService.compare(
      data.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      this.logService.warn(`Invalid password attempt for email: ${data.email}`);
      throw new BadRequestException('Invalid password');
    }

   const tokens = await this.refreshTokenService.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    this.logService.log(`User logged in: ${user.email} (ID: ${user.id})`);

    return {
      user,
      ...tokens,
    };
  }
  async refresh(refreshToken: string) {
    return this.refreshTokenService.refresh(refreshToken);
  }

  async logout(userId: string) {
    await this.refreshTokenService.revoke(userId);
    this.logService.log(`User logged out: ${userId}`);

    return {
      message: 'Logged out successfully',
    };
  }

}
