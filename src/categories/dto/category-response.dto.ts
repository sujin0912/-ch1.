import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: '공지사항',
  })
  name: string;

  @ApiProperty({
    example: '2026-08-23T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}