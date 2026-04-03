import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBoardDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    userId?: number;
}
