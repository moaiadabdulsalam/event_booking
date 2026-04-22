import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { registerDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RequestResetDto } from '../dto/request-reset.dto';
import { RolesGuard } from '../../../common/guard/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { PASSWORD_RESET_SERVICE } from '../../../common/constants/injection-tokens';
import type { IPasswordResetService } from '../interfaces/password-reset-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(PASSWORD_RESET_SERVICE)
    private readonly passwordResetService: IPasswordResetService,
  ) {}

  @Post('register')
  register(@Body() dto: registerDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: RequestResetDto) {
    return this.passwordResetService.requestReset(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(
      dto.email,
      dto.code,
      dto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-only')
  adminOnly() {
    return { message: 'Hello admin' };
  }
}
