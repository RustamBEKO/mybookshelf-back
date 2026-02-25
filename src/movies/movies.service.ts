import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    return await this.prisma.movie.create({ data: dto });
  }

  async findAll(year?: number, title?: string) {
    return await this.prisma.movie.findMany({
      where: {
        year: year ? year : undefined,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.movie.findUnique({ where: { id } });
  }

  async findOneWithReviews(id: string) {
  return this.prisma.movie.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      year: true,
      genre: true,

      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

  async remove(id: string) {
    return await this.prisma.movie.delete({ where: { id } });
  }
}
