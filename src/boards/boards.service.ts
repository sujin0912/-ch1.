import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

 create(createBoardDto: CreateBoardDto, userId: number) {
  return this.boardsRepository.create({
      ...createBoardDto,
      authorId: userId,
    });
}
  findAll() {
    return this.boardsRepository.findAll();
  }

  async findOne(id: number) {
    const post = await this.boardsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  findPostsByUserId(authorId: number) {
    return this.boardsRepository.findByUserId(authorId);
  }

 async update(id: number, updateBoardDto: UpdateBoardDto, userId: number) {
  const board = await this.boardsRepository.findOne(id);

  if (!board) {
    throw new NotFoundException('게시글을 찾을 수 없습니다.');
  }

  if (board.authorId !== userId) {
    throw new ForbiddenException('본인이 작성한 게시글만 수정할 수 있습니다.');
  }

  return this.boardsRepository.update(id, updateBoardDto);
}

 async remove(id: number, userId: number) {
  const board = await this.boardsRepository.findOne(id);

  if (!board) {
    throw new NotFoundException('게시글을 찾을 수 없습니다.');
  }

  if (board.authorId !== userId) {
    throw new ForbiddenException('본인이 작성한 게시글만 삭제할 수 있습니다.');
  }

  return this.boardsRepository.remove(id);
}
}