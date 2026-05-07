import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Рейтинг книги от 1 до 10', example: 8 })
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty({
    description: 'Комментарий к книге',
    example: 'Отличная книга!',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'ID книги, к которой относится отзыв',
    example: 'book-uuid',
  })
  @IsString()
  bookId: string;
}
