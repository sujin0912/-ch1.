import { Injectable } from '@nestjs/common';
import { Prisma} from '@prisma/client';
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

export type PostWithAuthor = Prisma.PostGetPayload<typeof postwithRelations>;
export type BoardListResult = {
  items: PostWithAuthor[];
  totalCount: number;
};

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto, authorId: string): Promise<PostWithAuthor> {
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
        ...postwithAuthor,
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


  async findOne(id: number): Promise<PostWithAuthor | null> {
    return this.prisma.post.findUnique({
      where: { id },
      ...postwithAuthor
    });
  }
 
  async findByUserId(authorId: string,): Promise<PostWithAuthor[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      ...postwithAuthor
    });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<PostWithRelations> {
    const {
      categoryId,
      ...postDate
    } = updateBoardDto;

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
      ...postwithRelations
    });
  }

  async remove(id: number): Promise<PostWithAuthor> {
    return this.prisma.post.delete({
      where: { id },
      ...postwithAuthor
    });
  }
}
