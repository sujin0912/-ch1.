import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: '게시글 제목입니다.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '게시글 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 1,
    description: '게시글이 속할 카테고리 ID',
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
