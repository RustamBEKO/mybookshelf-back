import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Создание отзыва' })
  @ApiResponse({ status: 201, description: 'Отзыв успешно создан.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @ApiOperation({ summary: 'Получение всех отзывов' })
  @ApiResponse({ status: 200, description: 'Отзывы успешно получены.' })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Получение отзывов по ID фильма' })
  @ApiResponse({ status: 200, description: 'Отзывы успешно получены.' })
  @ApiResponse({ status: 404, description: 'Фильм не найден.' })
  @Get('movie/:movieId')
  findByMovieId(@Param('movieId') movieId: string) {
    return this.reviewsService.findByMovieId(movieId);
  }

  @ApiOperation({ summary: 'Получение отзыва по ID' })
  @ApiResponse({ status: 200, description: 'Отзыв успешно получен.' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Удаление отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв успешно удалён.' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
