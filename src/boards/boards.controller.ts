import {Body,Controller,Delete,Get,Param,Patch,Post,Req,Query,ParseIntPipe,UseGuards,} from '@nestjs/common';
import {ApiOperation,ApiTags,} from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardListQueryDto } from './dto/board-list-query.dto';
import { BoardListResponseDto } from './dto/board-list-response.dto';
import { IdpAuthGuard } from '../auth/guard/idp-auth/idp-auth.guard';
import type {IdpAuthenticatedRequest,} from '../auth/type/idp-authenticated-request.type';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
  ) {}

  @ApiOperation({ summary: '게시글 생성' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req: IdpAuthenticatedRequest,
  ): Promise<BoardResponseDto> {
    return await this.boardsService.create(
      createBoardDto,
      req.user.id,
    );
  }

  @ApiOperation({ summary: '전체 게시글 조회' })
  @Get()
  async findAll(
    @Query() query: BoardListQueryDto,
  ): Promise<BoardListResponseDto> {
    return await this.boardsService.findAll(
      query.offset,
      query.limit,
    );
  }

  @ApiOperation({
    summary: '특정 유저가 작성한 게시글 조회',
  })
  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<BoardResponseDto[]> {
    return await this.boardsService.findPostsByUserId(
      userId,
    );
  }

  @ApiOperation({ summary: '게시글 단일 조회' })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BoardResponseDto> {
    return await this.boardsService.findOne(id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req: IdpAuthenticatedRequest,
  ): Promise<BoardResponseDto> {
    return await this.boardsService.update(
      id,
      updateBoardDto,
      req.user.id,
    );
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IdpAuthenticatedRequest,
  ): Promise<BoardResponseDto> {
    return await this.boardsService.remove(
      id,
      req.user.id,
    );
  }
}