import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../config/prisma/prisma.service';
import { Movie } from '../../domain/movie/movie.entity';
import { MovieMapper, movieWithGenresInclude } from '../mappers/movie.mapper';

type MovieQuery = {
  page: number;
  limit: number;
  search?: string;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
  genre?: string;
  maxClassification?: number;
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
  budget?: number;
  language?: string;
  genreIds?: number[];
};

@Injectable()
export class MoviesRepository {
  private readonly include = movieWithGenresInclude;

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: MoviePersistenceData): Promise<Movie> {
    const { genreIds = [], revenue, budget, ...movieData } = data;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        userId,
        revenue: this.formatDecimal(revenue),
        budget: this.formatDecimal(budget),
        genres: this.buildGenresCreate(genreIds),
      },
      include: this.include,
    });

    return MovieMapper.toDomain(movie);
  }

  async update(
    id: number,
    data: Partial<MoviePersistenceData>,
  ): Promise<Movie> {
    const { genreIds, revenue, budget, ...movieData } = data;

    const movie = await this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        revenue: this.formatDecimal(revenue),
        budget: this.formatDecimal(budget),
        genres: this.buildGenresUpdate(genreIds),
      },
      include: this.include,
    });

    return MovieMapper.toDomain(movie);
  }

  async findAll(userId: number, query: MovieQuery) {
    const where = this.buildWhere(query, userId);
    const { page, limit } = query;

    const [total, movies] = await Promise.all([
      this.prisma.movie.count({ where }),
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { releaseDate: 'desc' },
        include: this.include,
      }),
    ]);

    return {
      total,
      movies: movies.map(MovieMapper.toDomain),
    };
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: this.include,
    });

    if (!movie) throw new NotFoundException('Filme não encontrado');
    return MovieMapper.toDomain(movie);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.movieGenre.deleteMany({ where: { movieId: id } }),
      this.prisma.movie.delete({ where: { id } }),
    ]);
  }

  async findByReleaseDate(date: Date): Promise<Movie[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const movies = await this.prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: this.include,
    });

    return movies.map(MovieMapper.toDomain);
  }

  private formatDecimal(value?: number): Prisma.Decimal | undefined {
    return value !== undefined ? new Prisma.Decimal(value) : undefined;
  }

  private buildGenresCreate(genreIds: number[] = []) {
    return genreIds.length
      ? { create: this.mapGenreConnections(genreIds) }
      : undefined;
  }

  private buildGenresUpdate(genreIds?: number[]) {
    if (!Array.isArray(genreIds)) return undefined;
    return {
      deleteMany: {},
      create: this.mapGenreConnections(genreIds),
    };
  }

  private mapGenreConnections(genreIds: number[]) {
    return genreIds.map((id) => ({
      genre: { connect: { id } },
    }));
  }

  private buildWhere(
    query: MovieQuery,
    userId: number,
  ): Prisma.MovieWhereInput {
    const {
      search,
      minDuration,
      maxDuration,
      startDate,
      endDate,
      genre,
      maxClassification,
    } = query;

    const where: Prisma.MovieWhereInput = { userId };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {
        ...(minDuration && { gte: minDuration }),
        ...(maxDuration && { lte: maxDuration }),
      };
    }

    if (startDate || endDate) {
      where.releaseDate = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    if (genre) {
      where.genres = {
        some: {
          genre: {
            name: { equals: genre, mode: 'insensitive' },
          },
        },
      };
    }

    if (maxClassification !== undefined) {
      where.classification = { lte: maxClassification };
    }

    return where;
  }
}
