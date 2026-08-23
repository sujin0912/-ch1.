import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class BoardListQueryDto {
  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: '앞에서 건너뛸 게시글 개수',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: '한 번에 조회할 게시글 개수',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;
}
