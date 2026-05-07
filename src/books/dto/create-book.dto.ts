import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Genre } from 'src/generated/prisma/enums';

export class CreateBookDto {
  @ApiProperty({ description: 'Название книги', example: 'The Great Gatsby' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Описание книги' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Автор книги',
    example: 'F. Scott Fitzgerald',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'Год выпуска', example: 1925 })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear() + 5)
  year: number;

  @ApiProperty({ description: 'Жанр', enum: Genre })
  @IsEnum(Genre)
  genre: Genre;

  @ApiPropertyOptional({ description: 'URL обложки' })
  @IsOptional()
  @IsString()
  posterUrl?: string;
}
