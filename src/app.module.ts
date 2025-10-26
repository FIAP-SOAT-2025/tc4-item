import { Module } from '@nestjs/common';
import { PrismaService } from './shared/infra/prisma.service';
import { ItemModule } from './item/item.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule,
    ItemModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
