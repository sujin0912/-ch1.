import { ApiProperty } from '@nestjs/swagger';
import { BoardResponseDto } from './board-response.dto';

export class BoardListResponseDto {
  @ApiProperty({
    type: [BoardResponseDto],
  })
  items: BoardResponseDto[];

  @ApiProperty({
    example: 25,
    description: '전체 게시글 개수',
  })
  totalCount: number;
}