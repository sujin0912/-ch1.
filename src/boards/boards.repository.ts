import { Injectable } from '@nestjs/common';
import { Prisma} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

const postwithAuthor = {
  include: {
    author: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
    category: true,
  },
} satisfies Prisma.PostDefaultArgs;

export type PostWithAuthor = Prisma.PostGetPayload<typeof postwithAuthor>;
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
        categoryId: createBoardDto.categoryId,
        authorId,
      },
    ...postwithAuthor,
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

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<PostWithAuthor> {
    return this.prisma.post.update({
      where: { id },
      data: updateBoardDto,
     ...postwithAuthor,
    });
  }

  async remove(id: number): Promise<PostWithAuthor> {
    return this.prisma.post.delete({
      where: { id },
      ...postwithAuthor
    });
  }
}
