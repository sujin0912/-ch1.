import { Injectable} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Category, CategorySubscription,} from '@prisma/client';
import { PrismaService} from '../prisma/prisma.service';

const subscriptionWithCategory = {
    include: {
        category: true,
    },
} satisfies Prisma.CategorySubscriptionDefaultArgs;

export type SubscriptionWithCategory =
  Prisma.CategorySubscriptionGetPayload<typeof subscriptionWithCategory>;

@Injectable()
export class SubscriptionsRepository{
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findCategory(
        categoryId: number,
    ): Promise<Category|null> {
        return await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                deletedAt: null,
            },
        });
    }

    async findSubscription(
        userId: string,
        categoryId: number,
    ): Promise<CategorySubscription | null> {
        return await this.prisma.categorySubscription.findUnique({
            where: {
                userId_categoryId: {
                    userId,
                    categoryId,
                },
            },
        });
    }

    async create(
        userId: string,
        categoryId: number,
    ): Promise<SubscriptionWithCategory> {
        return await this.prisma.categorySubscription.create({
            data: {
                userId,
                categoryId,
            },
            ...subscriptionWithCategory,
        });
    }

    async remove(
        userId: string,
        categoryId: number,
    ): Promise<SubscriptionWithCategory> {
        return await this.prisma.categorySubscription.delete({
            where: {
                userId_categoryId: {
                    userId, categoryId,
                },
            },
            ...subscriptionWithCategory,
        });
    }

    async findAllByUser(
        userId: string,
    ): Promise<SubscriptionWithCategory[]> {
        return await this.prisma.categorySubscription.findMany({
            where: {
                userId, category: {
                    deletedAt: null,
                },
            },
           ...subscriptionWithCategory,

            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}