import { ApiProperty } from '@nestjs/swagger';

export class CategoryStatisticsResponseDto {
  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    example: 'evnet',
  })
  categoryName: string;

  @ApiProperty({
    example: 2,
  })
  postCount: number;

  @ApiProperty({
    example: 1,
  })
  subscriberCount: number;
}
