import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { registerDto } from '../dto/register.dto';
import { UserService } from '../../user/services/user.service';
import {
  PASSWORD_SERVICE,
  TOKEN_SERVICE,
} from '../../../common/constants/injection-tokens';
import type { IPasswordService } from '../interfaces/password-service.interface';
import { Role } from '../../../../generated/prisma/enums';
import type { ITokenService } from '../interfaces/token-service.interface';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
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

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);
    return {
      user,
      accessToken,
      refreshToken,
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

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
