import { Prisma } from '@prisma/client';

import { Movie } from '../../domain/movie/movie.entity';

export const movieWithGenresInclude = {
  genres: {
    include: {
      genre: true,
    },
  },
} satisfies Prisma.MovieInclude;

export type PrismaMovieWithGenres = Prisma.MovieGetPayload<{
  include: typeof movieWithGenresInclude;
}>;

export class MovieMapper {
  static toDomain(movie: PrismaMovieWithGenres): Movie {
    return new Movie({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      imageUrl: movie.imageUrl,
      classification: movie.classification ?? 0,
      rating: movie.rating ?? 0,
      trailerUrl: movie.trailerUrl,
      duration: movie.duration ?? 0,
      revenue: Number(movie.revenue ?? 0),
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      userId: movie.userId,
      genres: movie.genres.map((item) => item.genre.name),
    });
  }
}
