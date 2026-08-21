import { Injectable} from '@nestjs/common';
import { PrismaService} from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsRepository{
    constructor(
        private readonly prisma: PrismaService,
    ) {}


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

    async findActiveCategory(
        categoryId: number,
    ) {
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
    ) {
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
    ) {
        return await this.prisma.categorySubscription.create({
            data: {
                userId,
                categoryId,
            },
            include: {
                category: true,
            },
        });
    }

    async remove(
        userId: string,
        categoryId: number,
    ) {
        return await this.prisma.categorySubscription.delete({
            where: {
                userId_categoryId: {
                    userId, categoryId,
                },
            },
        });
    }

    async findAllByUser(
        userId: string,
    ) {
        return await this.prisma.categorySubscription.findMany({
            where: {
                userId, category: {
                    deletedAt: null,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}