import { IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Genre } from 'src/generated/prisma/enums';

export class CreateMovieDto {
    
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsInt()
    @Min(1888) // The year the first movie was made
    @Max(new Date().getFullYear()) // Current year
    year: number;

    @IsEnum(Genre)
    genre: Genre;
}
