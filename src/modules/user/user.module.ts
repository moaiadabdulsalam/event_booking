import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY } from '../../common/constants/injection-tokens';

@Module({
  providers: [UserService ,   
    {
      provide: USERS_REPOSITORY,
      useClass : UsersRepository
    },
  ],
  exports: [UserService ,USERS_REPOSITORY],
})
export class UserModule {}
