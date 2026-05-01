import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createBoardDto: CreateBoardDto) {
    return this.prisma.post.create({
      data: {
        title: createBoardDto.title,
        content: createBoardDto.content,
        authorId: createBoardDto.authorId,
      },
      include: {
        author: true,
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  findByUserId(authorId: number) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return this.prisma.post.update({
      where: { id },
      data: updateBoardDto,
      include: {
        author: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}