import { Injectable, NotFoundException } from '@nestjs/common';
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

  private handleNotFound(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(message);
    }

    throw error;
  }

  async create(
    createBoardDto: CreateBoardDto,
    authorId: string,
  ): Promise<PostWithRelations> {
    return this.prisma.post
      .create({
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
      })
      .catch((error: unknown) =>
        this.handleNotFound(
          error,
          '사용자 또는 사용할 수 있는 카테고리를 찾을 수 없습니다.',
        ),
      );
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

  async findOne(id: number): Promise<PostWithRelations> {
    return this.prisma.post
    .findUniqueOrThrow({
        where: { id },
        ...postwithRelations,
    })
      .catch((error: unknown) =>
        this.handleNotFound(error, 'Post with id ${id} not found'),
      );
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

    return this.prisma.post
      .update({
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
      })
      .catch((error: unknown) =>
        this.handleNotFound(
          error,
          '게시글 또는 사용할 수 있는 카테고리를 찾을 수 없습니다.',
        ),
      );
  }

  async remove(id: number): Promise<PostWithRelations> {
    return this.prisma.post
      .delete({
        where: { id },
        ...postwithRelations,
      })
      .catch((error: unknown) =>
        this.handleNotFound(error, '삭제할 게시클을 찾을 수 없습니다.'),
      );
  }
}
