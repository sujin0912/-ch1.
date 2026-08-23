import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class SubscriptionResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    example: '2026-08-23T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: CategoryResponseDto,
  })
  category: CategoryResponseDto;
}
