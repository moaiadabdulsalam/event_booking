import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaUnitOfWork } from './transcation/prisma-unit-of-work';
import { UNIT_OF_WORK } from '../common/constants/injection-tokens';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    PrismaUnitOfWork,
    {
      provide: UNIT_OF_WORK,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [PrismaService, UNIT_OF_WORK],
})
export class PrismaModule {}
