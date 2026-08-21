import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAllActive() {
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
  ) {
    return await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async findActiveById(
    id: number,
  ) {
    return await this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async create(
    name: string,
  ) {
    return await this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  async restore(
    id: number,
  ) {
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
  ) {
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