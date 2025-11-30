import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.movie.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this movie',
      );
    }

    return movie;
  }

  async update(id: number, userId: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this movie',
      );
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this movie',
      );
    }

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
