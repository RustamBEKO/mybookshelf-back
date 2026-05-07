import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryBooksDto } from './dto/query-books.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    return await this.prisma.book.create({ data: dto });
  }

  async findAll(query: QueryBooksDto) {
    const {
      page = 1,
      limit = 10,
      genre,
      year,
      title,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    // Build the WHERE clause dynamically
    const where: any = {};
    if (genre) where.genre = genre;
    if (year) where.year = year;
    if (title) where.title = { contains: title, mode: 'insensitive' };

    const skip = (page - 1) * limit; // e.g. page 2, limit 10 → skip 10

    // Run data query AND count query at the same time (parallel = faster)
    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: {
          _count: { select: { reviews: true } }, // adds reviewsCount
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total, // total matching records
        page, // current page
        limit, // items per page
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async findOneWithReviews(id: string) {
    return this.prisma.book.findUnique({
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
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, dto: UpdateBookDto) {
    return await this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return await this.prisma.book.delete({ where: { id } });
  }
}
