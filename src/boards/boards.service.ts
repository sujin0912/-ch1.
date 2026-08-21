import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {BoardListResult, BoardsRepository, PostWithAuthor, } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CategoriesService} from '../categories/categories.service';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository,
              private readonly categoriesService: CategoriesService,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: string): Promise<PostWithAuthor> {
    await this.categoriesService.findActiveByIdOrThrow(
      createBoardDto.categoryId,
    );

  return await this.boardsRepository.create(
    createBoardDto,
    userId,
  );
}
  async findAll(offset: number, limit: number): Promise<BoardListResult> {
    return await this.boardsRepository.findAll(offset, limit);
  }

  async findOne(id: number): Promise<PostWithAuthor> {
    const post = await this.boardsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async findPostsByUserId(authorId: string): Promise<PostWithAuthor[]> {
    return await this.boardsRepository.findByUserId(authorId);
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, userId: string): Promise<PostWithAuthor> {
   
    if(updateBoardDto.categoryId !==undefined) {
      await this.categoriesService.findActiveByIdOrThrow(
        updateBoardDto.categoryId,
      );
    }
   
    const board = await this.findOne(id);

  if (board.authorId !== userId) {
    throw new ForbiddenException('본인이 작성한 게시글만 수정할 수 있습니다.');
  }

    return await this.boardsRepository.update(id, updateBoardDto);
}

 async remove(id: number, userId: string) {
  const board = await this.findOne(id);

  if (board.authorId !== userId) {
    throw new ForbiddenException('본인이 작성한 게시글만 삭제할 수 있습니다.');
  }

  return await this.boardsRepository.remove(id);
}
}