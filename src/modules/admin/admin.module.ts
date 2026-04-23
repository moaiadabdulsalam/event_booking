import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { ADMIN_REPOSITORY } from '../../common/constants/injection-tokens';
import { AdminController } from './controllers/admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({

  imports : [AuthModule], 
  providers: [
    AdminService,
    {
      provide: ADMIN_REPOSITORY,
      useClass: AdminRepository,
    },
  ],
  controllers: [AdminController],
})
export class AdminModule {}
