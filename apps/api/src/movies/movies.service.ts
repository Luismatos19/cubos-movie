import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../config/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { r2Client } from '../config/r2.client';
import { GetMoviesDto } from './dto/get-movies.dto';

const movieWithGenresInclude = Prisma.validator<Prisma.MovieInclude>()({
  genres: {
    include: {
      genre: true,
    },
  },
});

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private bucketName = process.env.R2_BUCKET_NAME!;
  private readonly movieInclude = movieWithGenresInclude;

  constructor(private prisma: PrismaService) {}

  async uploadBufferToR2(
    originalName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens são permitidas');
    }

    const extension =
      this.getExtension(originalName) || this.getExtFromMime(mimeType) || 'png';
    const key = `movies/${uuid()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    try {
      await r2Client.send(command);

      const fileUrl = `${process.env.R2_ENDPOINT}/${this.bucketName}/${key}`;
      return { key, fileUrl };
    } catch (err) {
      console.error('R2 upload error', err);
      throw new InternalServerErrorException(
        'Erro ao enviar arquivo para storage',
      );
    }
  }

  async create(userId: number, createMovieDto: CreateMovieDto) {
    const { genreIds = [], revenue = 0, ...movieData } = createMovieDto;

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
      include: this.movieInclude,
    });

    this.logger.log(`Filme criado com sucesso: ${movie.id}`);
    return this.mapMovie(movie);
  }

  async findAll(userId: number, query: GetMoviesDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search?.trim() || '';

    const where: Prisma.MovieWhereInput = { userId };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.movie.count({ where }),
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          releaseDate: 'desc',
        },
        include: this.movieInclude,
      }),
    ]);

    return {
      items: items.map((movie) => this.mapMovie(movie)),
      pagination: {
        page,
        perPage: limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: this.movieInclude,
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou acessar filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para acessar este filme',
      );
    }

    this.logger.log(`Filme ${id} encontrado com sucesso`);
    return this.mapMovie(movie);
  }

  async update(id: number, userId: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado para atualização`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou editar filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para editar este filme',
      );
    }

    const { genreIds, revenue, ...movieData } = updateMovieDto;

    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        revenue:
          revenue !== undefined ? new Prisma.Decimal(revenue) : undefined,
        genres: genreIds
          ? {
              deleteMany: {},
              create: this.buildGenreConnections(genreIds),
            }
          : undefined,
      },
      include: this.movieInclude,
    });

    this.logger.log(`Filme ${id} atualizado com sucesso`);
    return this.mapMovie(updatedMovie);
  }

  async remove(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado para exclusão`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou excluir filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para excluir este filme',
      );
    }

    await this.prisma.movieGenre.deleteMany({
      where: { movieId: id },
    });

    await this.prisma.movie.delete({
      where: { id },
    });

    this.logger.log(`Filme ${id} excluído com sucesso`);
  }

  private getExtension(filename: string) {
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }

  private getExtFromMime(mime: string) {
    if (mime === 'image/jpeg') return 'jpg';
    if (mime === 'image/png') return 'png';
    if (mime === 'image/webp') return 'webp';
    if (mime === 'image/gif') return 'gif';
    return null;
  }

  private buildGenreConnections(genreIds: number[]) {
    return genreIds.map((genreId) => ({
      genre: { connect: { id: genreId } },
    }));
  }

  private mapMovie(
    movie: Prisma.MovieGetPayload<{
      include: typeof movieWithGenresInclude;
    }>,
  ) {
    return {
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
    };
  }
}
