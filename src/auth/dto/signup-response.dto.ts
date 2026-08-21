import {ApiProperty} from '@nestjs/swagger';

export class SignupResponseDto {
    @ApiProperty({example: '550e8400-e29b-41d4-a716-446655440000'})
    id : string;

    @ApiProperty({example: 'test@test.com'})
    email : string;

    @ApiProperty({example: '수진'})
    name : string;
}