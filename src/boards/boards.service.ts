import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  create(createBoardDto: CreateBoardDto) {
    return this.boardsRepository.create(createBoardDto);
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

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.findOne(id);

    return this.boardsRepository.update(id, updateBoardDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.boardsRepository.remove(id);
  }
}