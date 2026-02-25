import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Рейтинг фильма от 1 до 10', example: 8 })
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({ description: 'Комментарий к фильму', example: 'Отличный фильм!' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'ID пользователя, оставившего отзыв', example: 'user123' })
  @IsString()
  userId: string;
  @IsString()
  movieId: string;
}
