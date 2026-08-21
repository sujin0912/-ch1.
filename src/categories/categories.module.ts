import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    CategoriesController,
  ],
  providers: [
    CategoriesService,
    CategoriesRepository,
  ],
  exports: [
    CategoriesService,
  ],
})
export class CategoriesModule {}