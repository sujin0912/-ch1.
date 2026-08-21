import { Body, Get, Delete, Param, ParseIntPipe, Post, UseGuards, Controller } from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {IdpAuthGuard} from '../auth/guard/idp-auth/idp-auth.guard';
import {CategoriesService} from './categories.service';
import{ CreateCategoryDto} from './dto/create-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService:
      CategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(IdpAuthGuard)
  create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(
      createCategoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(IdpAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.remove(id);
  }
}