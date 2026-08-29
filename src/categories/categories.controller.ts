import {
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryStatisticsResponseDto } from './dto/category-statistics-response.dto';
import type { IdpAuthenticatedRequest } from '../auth/type/idp-authenticated-request.type';
import { MyCategorySummaryResponseDto } from './dto/my-category-summary-response.dto';

@ApiTags('categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('statistics')
  findStatistics(): Promise<CategoryStatisticsResponseDto[]> {
    return this.categoriesService.findStatistics();
  }

  @Get('me/summary')
  @UseGuards(JwtAuthGuard)
  findMySummary(
    @Req()
    request: IdpAuthenticatedRequest,
  ): Promise<MyCategorySummaryResponseDto[]> {
    return this.categoriesService.findMySummary(request.user.id);
  }

  @Get()
  findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.remove(id);
  }
}
