import {Body,Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    return this.boardsService.create(createBoardDto, req.user.id);
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req,
  ) {
    return this.boardsService.update(+id, updateBoardDto, req.user.id);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.boardsService.remove(+id, req.user.id);
  }
}