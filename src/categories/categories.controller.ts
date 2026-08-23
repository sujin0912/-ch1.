import { Body, Get, Delete, Param, ParseIntPipe, Post, UseGuards, Controller } from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import{JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CategoriesService} from './categories.service';
import{ CreateCategoryDto} from './dto/create-category.dto';
import { BoardCategoryReponseDto } from '../boards/dto/board-response.dto';
import type { Category } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService:
      CategoriesService,
  ) {}

  @Get()
  findAll(): Promise<BoardCategoryReponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ):Promise<BoardCategoryReponseDto> {
    return this.categoriesService.create(
      createCategoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<BoardCategoryReponseDto> {
    return this.categoriesService.remove(id);
  }
}