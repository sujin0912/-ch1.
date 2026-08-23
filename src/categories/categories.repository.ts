import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findByName(
    name: string,
  ): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async findById(
    id: number,
  ): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async create(
    name: string,
  ): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  async restore(
    id: number,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async softDelete(
    id: number,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}