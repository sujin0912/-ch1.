import {BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository:
      CategoriesRepository,
  ) {}

  async findActiveByIdOrThrow( id: number) {
    const category = await this.categoriesRepository.findActiveById(id);

    if(!category) {
      throw new NotFoundException (
        '사용할 수 있는 카테고리를 찾을 수 없습니다.',
      );
    }
    return category;    
  }

  async findAll() {
    return await this.categoriesRepository
      .findAllActive();
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ) {
    const name =
      createCategoryDto.name.trim();

    if (!name) {
      throw new BadRequestException(
        '카테고리 이름을 입력해야 합니다.',
      );
    }

    const existingCategory =
      await this.categoriesRepository.findByName(
        name,
      );

    if (existingCategory) {
      if (
        existingCategory.deletedAt === null
      ) {
        throw new ConflictException(
          '이미 존재하는 카테고리입니다.',
        );
      }

      return await this.categoriesRepository
        .restore(existingCategory.id);
    }

    return await this.categoriesRepository
      .create(name);
  }

  async remove(
    id: number,
  ) {
    const category =
      await this.categoriesRepository
        .findActiveById(id);

    if (!category) {
      throw new NotFoundException(
        '카테고리를 찾을 수 없습니다.',
      );
    }

    return await this.categoriesRepository
      .softDelete(id);
  }
}