import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { CategoryStatisticsResponseDto } from './dto/category-statistics-response.dto';
import { MyCategorySummaryResponseDto } from './dto/my-category-summary-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findByIdOrThrow(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(
        '사용할 수 있는 카테고리를 찾을 수 없습니다.',
      );
    }
    return category;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async findStatistics(): Promise<CategoryStatisticsResponseDto[]> {
    const categories = await this.categoriesRepository.findStatistics();

    return categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      postCount: category._count.posts,
      subscriberCount: category._count.subscriptions,
    }));
  }
  async findMySummary(userId: string): Promise<MyCategorySummaryResponseDto[]> {
    const categories = await this.categoriesRepository.findUserSummary(userId);

    return categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      isSubscribed: category._count.subscriptions > 0,
      myPostCount: category._count.posts,
    }));
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const name = createCategoryDto.name.trim();

    if (!name) {
      throw new BadRequestException('카테고리 이름을 입력해야 합니다.');
    }

    const existingCategory = await this.categoriesRepository.findByName(name);

    if (existingCategory) {
      if (existingCategory.deletedAt === null) {
        throw new ConflictException('이미 존재하는 카테고리입니다.');
      }

      return await this.categoriesRepository.restore(existingCategory.id);
    }

    return await this.categoriesRepository.create(name);
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    return await this.categoriesRepository.softDelete(id);
  }
}
