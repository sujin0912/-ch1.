import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Category } from '@prisma/client';
import { Prisma } from '@prisma/client';

const categoryWithCounts = {
  select: {
    id: true,
    name: true,
    _count: {
      select: {
        posts: true,
        subscriptions: true,
      },
    },
  },
} satisfies Prisma.CategoryDefaultArgs;

export type CategoryWithCounts = Prisma.CategoryGetPayload<
  typeof categoryWithCounts
>;

export type CategoryUserSummary = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    _count: {
      select: {
        posts: true;
        subscriptions: true;
      };
    };
  };
}>;

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findStatistics(): Promise<CategoryWithCounts[]> {
    return await this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
      ...categoryWithCounts,
    });
  }

  async findUserSummary(userId: string): Promise<CategoryUserSummary[]> {
    return await this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            posts: {
              where: {
                authorId: userId,
              },
            },
            subscriptions: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async create(name: string): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  async restore(id: number): Promise<Category> {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async softDelete(id: number): Promise<Category> {
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
