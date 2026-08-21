import {ApiProperty} from '@nestjs/swagger';

export class BoardResponseDto{
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '게시글' })
    title: string;

    @ApiProperty({ example: '게시글 내용' })
    content: string;

    @ApiProperty({example: '550e8400-e29b-41d4-a716-446655440000'})
    authorId: string;

    @ApiProperty({example: '2024-06-05T12:00:00Z',})
    createdAt: Date;

    @ApiProperty({example: '2024-06-05T12:00:00Z',})
    updatedAt: Date;
}