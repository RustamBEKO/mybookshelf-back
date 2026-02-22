import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(dto: CreateMovieDto) {
    return await this.prisma.movie.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.movie.findMany();
  }

  async findAllWithReviews() {
    return await this.prisma.movie.findMany({ include: { reviews: true } });
  }
  async findOne(id: string) {
    return await this.prisma.movie.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return await this.prisma.movie.delete({ where: { id } });
  }
}
