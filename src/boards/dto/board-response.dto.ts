import { ApiProperty } from '@nestjs/swagger';

export class BoardCategoryResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: '공지사항',
  })
  name: string;
}

export class BoardResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: '게시글',
  })
  title: string;

  @ApiProperty({
    example: '게시글 내용',
  })
  content: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  authorId: string;

  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    type: () => BoardCategoryResponseDto,
  })
  category: BoardCategoryResponseDto;

  @ApiProperty({
    example: '2026-08-23T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-08-23T12:00:00.000Z',
  })
  updatedAt: Date;
}
