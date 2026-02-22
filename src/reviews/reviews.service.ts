import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
   constructor(private readonly prisma: PrismaService) {}
  
   async create(dto: CreateReviewDto) {
    return await this.prisma.review.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.review.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.review.findUnique({ where: { id } });
  }

  async findByMovieId(movieId: string) {
    return await this.prisma.review.findMany({ where: { movieId }, include: { user: true, movie: true } });
  }

  async remove(id: string) {
    return await this.prisma.review.delete({ where: { id } });
  }
}
