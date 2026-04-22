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
  ) {}

  async register(data: registerDto) {
    const existingUser = await this.userService.getUserByEmail(data.email);
    if (existingUser) {
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

    return {
      user,
      ...tokens,
    };
   
  }

  async login(data: LoginDto) {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email already in use');
    }

    const isValidPassword = await this.passwordService.compare(
      data.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

   const tokens = await this.refreshTokenService.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

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

    return {
      message: 'Logged out successfully',
    };
  }

}
