import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../config/prisma/prisma.service';
import { Movie } from '../../domain/movie/movie.entity';
import { MovieMapper, movieWithGenresInclude } from '../mappers/movie.mapper';

type MovieQuery = {
  page: number;
  limit: number;
  search?: string;
};

type MoviePersistenceData = {
  title: string;
  description?: string;
  releaseDate: Date;
  imageUrl: string;
  classification?: number;
  rating?: number;
  trailerUrl?: string;
  duration?: number;
  revenue?: number;
  genreIds?: number[];
};

@Injectable()
export class MoviesRepository {
  private readonly include = movieWithGenresInclude;

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: MoviePersistenceData): Promise<Movie> {
    const { genreIds = [], revenue = 0, ...movieData } = data;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        revenue: new Prisma.Decimal(revenue),
        userId,
        genres: genreIds.length
          ? {
              create: this.buildGenreConnections(genreIds),
            }
          : undefined,
      },
      include: this.include,
    });

    return MovieMapper.toDomain(movie);
  }

  async update(
    id: number,
    data: Partial<MoviePersistenceData>,
  ): Promise<Movie> {
    const { genreIds, revenue, ...movieData } = data;

    const movie = await this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        revenue:
          revenue !== undefined ? new Prisma.Decimal(revenue) : undefined,
        genres: Array.isArray(genreIds)
          ? {
              deleteMany: {},
              create: this.buildGenreConnections(genreIds),
            }
          : undefined,
      },
      include: this.include,
    });

    return MovieMapper.toDomain(movie);
  }

  async findAll(userId: number, query: MovieQuery) {
    const { page, limit, search } = query;
    const where: Prisma.MovieWhereInput = { userId };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [total, movies] = await Promise.all([
      this.prisma.movie.count({ where }),
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          releaseDate: 'desc',
        },
        include: this.include,
      }),
    ]);

    return {
      total,
      movies: movies.map((movie) => MovieMapper.toDomain(movie)),
    };
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: this.include,
    });

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    return MovieMapper.toDomain(movie);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.movieGenre.deleteMany({
      where: { movieId: id },
    });

    await this.prisma.movie.delete({
      where: { id },
    });
  }

  private buildGenreConnections(genreIds: number[]) {
    return genreIds.map((genreId) => ({
      genre: { connect: { id: genreId } },
    }));
  }
}
