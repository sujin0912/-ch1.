import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'event',
  })
  @IsString()
  @Matches(/\S/, {
    message: '카테고리 이름을 입력해야 합니다.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;
}
