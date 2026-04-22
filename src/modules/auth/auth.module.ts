import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { PASSWORD_SERVICE, TOKEN_SERVICE } from '../../common/constants/injection-tokens';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[JwtModule.register({}) , UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    {
      provide: PASSWORD_SERVICE,
      useClass: PasswordService,
    },
    {
      provide : TOKEN_SERVICE,
      useClass : TokenService
    }
  ],
})
export class AuthModule {}
