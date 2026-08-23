import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

const postwithRelations = {
  include: {
    author: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  },
} satisfies Prisma.PostDefaultArgs;

export type PostWithRelations = Prisma.PostGetPayload<typeof postwithRelations>;
export type BoardListResult = {
  items: PostWithRelations[];
  totalCount: number;
};

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createBoardDto: CreateBoardDto,
    authorId: string,
  ): Promise<PostWithRelations> {
    return this.prisma.post.create({
      data: {
        title: createBoardDto.title,
        content: createBoardDto.content,

        author: {
          connect: {
            id: authorId,
          },
        },

        category: {
          connect: {
            id: createBoardDto.categoryId,
            deletedAt: null,
          },
        },
      },
      ...postwithRelations,
    });
  }

  async findAll(offset: number, limit: number): Promise<BoardListResult> {
    const [items, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        ...postwithRelations,
        orderBy: {
          id: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.post.count(),
    ]);

    return { items, totalCount };
  }

  async findOne(id: number): Promise<PostWithRelations | null> {
    return this.prisma.post.findUnique({
      where: { id },
      ...postwithRelations,
    });
  }

  async findByUserId(authorId: string): Promise<PostWithRelations[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      ...postwithRelations,
    });
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<PostWithRelations> {
    const { categoryId, ...postDate } = updateBoardDto;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postDate,

        ...(categoryId !== undefined
          ? {
              category: {
                connect: {
                  id: categoryId,
                  deletedAt: null,
                },
              },
            }
          : {}),
      },
      ...postwithRelations,
    });
  }

  async remove(id: number): Promise<PostWithRelations> {
    return this.prisma.post.delete({
      where: { id },
      ...postwithRelations,
    });
  }
}
