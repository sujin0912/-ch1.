import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: '첫 번째 게시글' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: '게시글 내용입니다.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  authorId!: number;
}