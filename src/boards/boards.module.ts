import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardsRepository } from './boards.repository';
import { CategoriesModule} from '../categories/categories.module';
import {AuthModule} from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CategoriesModule, PrismaModule, AuthModule],
  controllers: [BoardsController,],
  providers: [BoardsService, BoardsRepository],
})
export class BoardsModule {}