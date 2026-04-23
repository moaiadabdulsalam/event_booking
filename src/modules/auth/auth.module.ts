import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { OTP_REPOSITORY, OTP_SERVICE, PASSWORD_RESET_SERVICE, PASSWORD_SERVICE, REFRESH_TOKEN_SERVICE, TOKEN_SERVICE } from '../../common/constants/injection-tokens';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './services/refresh-token.service';
import { OtpService } from './services/otp.service';
import { PasswordResetService } from './services/password-reset.service';
import { OtpRepository } from './repositories/otp.repository';
import { MainService } from './services/main.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { LogsModule } from '../logs/logs.module';
import { AppLogger } from '../../common/logger/app-logger.service';


@Module({
  imports:[JwtModule.register({}) , UserModule, LogsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepository,
    },
    {
      provide: PASSWORD_SERVICE,
      useClass: PasswordService,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
    {
      provide: REFRESH_TOKEN_SERVICE,
      useClass: RefreshTokenService,
    },
    {
      provide: OTP_SERVICE,
      useClass: OtpService,
    },
    {
      provide: PASSWORD_RESET_SERVICE,
      useClass: PasswordResetService,
    },
    {
      provide: 'MAIL_SERVICE',
      useClass: MainService,
    },
    RefreshTokenService,
    OtpService,
    PasswordResetService,
    MainService,
    JwtAuthGuard,
    AppLogger
  ],
  exports: [JwtModule , JwtAuthGuard],
})
export class AuthModule {}
