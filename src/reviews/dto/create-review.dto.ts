import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  userId: string;
  @IsString()
  movieId: string;
}
