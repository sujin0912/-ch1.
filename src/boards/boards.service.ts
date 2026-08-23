import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BoardListResult,
  BoardsRepository,
  PostWithRelations,
} from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<PostWithRelations> {
    return this.boardsRepository.create(createBoardDto, userId);
  }

  async findAll(offset: number, limit: number): Promise<BoardListResult> {
    return await this.boardsRepository.findAll(offset, limit);
  }

  async findOne(id: number): Promise<PostWithRelations> {
    const post = await this.boardsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async findPostsByUserId(authorId: string): Promise<PostWithRelations[]> {
    return await this.boardsRepository.findByUserId(authorId);
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<PostWithRelations> {
    const board = await this.findOne(id);

    if (board.authorId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 게시글만 수정할 수 있습니다.',
      );
    }

    try {
      return await this.boardsRepository.update(id, updateBoardDto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          '게시글 또는 사용할 수 있는 카테고리를 찾을 수 없습니다.',
        );
      }
      throw error;
    }
  }

  async remove(id: number, userId: string): Promise<PostWithRelations> {
    const board = await this.findOne(id);

    if (board.authorId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 게시글만 삭제할 수 있습니다.',
      );
    }

    return await this.boardsRepository.remove(id);
  }
}
