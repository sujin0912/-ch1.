import {Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @ApiOperation({ summary: '전체 게시글 조회' })
  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @ApiOperation({ summary: '특정 유저가 작성한 게시글 조회' })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.boardsService.findPostsByUserId(+userId);
  }

  @ApiOperation({ summary: '게시글 단일 조회' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(+id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}