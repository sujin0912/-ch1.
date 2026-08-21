import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserResponseDto {
  @ApiProperty({ example: '103764822355299024068' })
  googleId: string;

  @ApiProperty({ example: 'test@gmail.com' })
  email?: string;

  @ApiProperty({ example: '유수진' })
  name: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/...',
  })
  picture?: string;
}