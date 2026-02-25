import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Создание фильма' })
  @ApiResponse({ status: 201, description: 'Фильм успешно создан.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех фильмов' })
  @ApiResponse({ status: 200, description: 'Фильмы успешно получены.' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Год выпуска фильма',
  })
  @ApiQuery({ name: 'title', required: false, description: 'Название фильма' })
  @Get()
  findAll(@Query('year') year?: string, @Query('title') title?: string) {
    return this.moviesService.findAll(year ? Number(year) : undefined, title);
  }

  @ApiOperation({ summary: 'Получение фильма с отзывами' })
  @ApiResponse({
    status: 200,
    description: 'Фильм с отзывами успешно получен.',
  })
  @ApiResponse({ status: 404, description: 'Фильм не найден.' })
  @Get(':id/reviews')
  findOneWithReviews(@Param('id') id: string) {
    return this.moviesService.findOneWithReviews(id);
  }

  @ApiOperation({ summary: 'Получение фильма по ID' })
  @ApiResponse({ status: 200, description: 'Фильм успешно получен.' })
  @ApiResponse({ status: 404, description: 'Фильм не найден.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({ summary: 'Удаление фильма' })
  @ApiResponse({ status: 200, description: 'Фильм успешно удалён.' })
  @ApiResponse({ status: 404, description: 'Фильм не найден.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
