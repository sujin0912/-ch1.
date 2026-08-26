import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  BoardListResult,
  BoardsRepository,
  PostWithRelations,
} from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PushService } from '../push/push.service';

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardsRepository: BoardsRepository,
    private readonly pushService: PushService,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<PostWithRelations> {
    const board = await this.boardsRepository.create(createBoardDto, userId);

    this.pushService.sendToCategorySubscribers(board.categoryId);

    return board;
  }

  async findAll(offset: number, limit: number): Promise<BoardListResult> {
    return await this.boardsRepository.findAll(offset, limit);
  }

  async findOne(id: number): Promise<PostWithRelations> {
    return await this.boardsRepository.findOne(id);
  }

  async findPostsByUserId(authorId: string): Promise<PostWithRelations[]> {
    return await this.boardsRepository.findByUserId(authorId);
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<PostWithRelations> {
    const board = await this.boardsRepository.findOne(id);

    if (board.authorId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 게시글만 수정할 수 있습니다.',
      );
    }

    return await this.boardsRepository.update(id, updateBoardDto);
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
