import { BadRequestException, Injectable } from '@nestjs/common';

import { R2UploaderService } from '../../infra/storage/r2-uploader.service';
import { MoviesRepository } from '../../infra/repositories/movies.repository';
import { CheckOwnerRule } from '../../domain/movie/rules/check-owner.rule';
import { GetMoviesDto } from '../../movies/dto/get-movies.dto';
import { CreateMovieDto } from '../../movies/dto/create-movie.dto';
import { UpdateMovieDto } from '../../movies/dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly uploader: R2UploaderService,
  ) {}

  async create(
    userId: number,
    payload: CreateMovieDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo obrigatório');
    }

    const { url } = await this.uploader.upload(file);

    return this.moviesRepository.create(userId, {
      ...payload,
      imageUrl: url,
    });
  }

  async findAll(userId: number, query: GetMoviesDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { movies, total } = await this.moviesRepository.findAll(userId, {
      page,
      limit,
      search: query.search,
      minDuration: query.minDuration,
      maxDuration: query.maxDuration,
      startDate: query.startDate,
      endDate: query.endDate,
      genre: query.genre,
      maxClassification: query.maxClassification,
    });

    return {
      items: movies,
      pagination: {
        page,
        perPage: limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const movie = await this.moviesRepository.findById(id);
    CheckOwnerRule.ensure(movie, userId);
    return movie;
  }

  async update(id: number, userId: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.findById(id);
    CheckOwnerRule.ensure(movie, userId);

    return this.moviesRepository.update(id, updateMovieDto);
  }

  async remove(id: number, userId: number) {
    const movie = await this.moviesRepository.findById(id);
    CheckOwnerRule.ensure(movie, userId);
    await this.moviesRepository.delete(id);
  }
}
