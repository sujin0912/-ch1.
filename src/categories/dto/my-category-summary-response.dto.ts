import { ApiProperty } from '@nestjs/swagger';

export class MyCategorySummaryResponseDto {
  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    example: 'event',
  })
  categoryName: string;

  @ApiProperty({
    example: 2,
  })
  myPostCount: number;
}
