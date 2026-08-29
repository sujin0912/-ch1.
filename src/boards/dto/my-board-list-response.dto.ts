import { ApiProperty } from '@nestjs/swagger';
import { BoardResponseDto } from './board-response.dto';

export class MyBoardListResponseDto {
  @ApiProperty({
    type: [BoardResponseDto],
  })
  items: BoardResponseDto[];

  @ApiProperty({
    example: 1,
  })
  page: number;

  @ApiProperty({
    example: 10,
  })
  limit: number;

  @ApiProperty({
    example: true,
  })
  hasNext: boolean;
}
