import { BadRequestException } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { MoviesRepository } from '../../infra/repositories/movies.repository';
import { R2UploaderService } from '../../infra/storage/r2-uploader.service';
import { Movie } from '../../domain/movie/movie.entity';
import { CreateMovieDto } from '../../movies/dto/create-movie.dto';
import { UpdateMovieDto } from '../../movies/dto/update-movie.dto';

const createMovie = (overrides: Partial<Movie> = {}) =>
  new Movie({
    id: 1,
    title: 'Movie',
    description: 'Desc',
    releaseDate: new Date('2024-01-01'),
    imageUrl: 'http://image',
    classification: 12,
    rating: 80,
    trailerUrl: 'http://trailer',
    duration: 120,
    revenue: 100,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    userId: 10,
    genres: ['Ação'],
    ...overrides,
  });

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: jest.Mocked<MoviesRepository>;
  let uploader: jest.Mocked<R2UploaderService>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<MoviesRepository>;

    uploader = {
      upload: jest.fn(),
    } as unknown as jest.Mocked<R2UploaderService>;

    service = new MoviesService(repository, uploader);
  });

  describe('create', () => {
    it('should upload poster and create movie', async () => {
      const dto = {
        title: 'Title',
        releaseDate: new Date(),
        imageUrl: '',
      } as unknown as CreateMovieDto;
      const file = {
        originalname: 'poster.png',
      } as Express.Multer.File;

      uploader.upload.mockResolvedValue({
        key: 'poster.png',
        url: 'http://uploaded',
      });
      const movie = createMovie({ imageUrl: 'http://uploaded' });
      repository.create.mockResolvedValue(movie);

      const result = await service.create(10, dto, file);

      expect(uploader.upload).toHaveBeenCalledWith(file);
      expect(repository.create).toHaveBeenCalledWith(10, {
        ...dto,
        imageUrl: 'http://uploaded',
      });
      expect(result).toBe(movie);
    });

    it('should throw when file is missing', async () => {
      await expect(
        service.create(10, {} as CreateMovieDto, undefined),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated movies', async () => {
      const movie = createMovie();
      repository.findAll.mockResolvedValue({ movies: [movie], total: 1 });

      const response = await service.findAll(10, { page: '1', limit: '10' });

      expect(repository.findAll).toHaveBeenCalledWith(10, {
        page: 1,
        limit: 10,
        search: undefined,
      });
      expect(response).toEqual({
        items: [movie],
        pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return movie when owner matches', async () => {
      const movie = createMovie({ userId: 5 });
      repository.findById.mockResolvedValue(movie);

      const result = await service.findOne(1, 5);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(movie);
    });
  });

  describe('update', () => {
    it('should update after ownership check', async () => {
      const movie = createMovie({ userId: 5 });
      repository.findById.mockResolvedValue(movie);
      const updated = createMovie({ title: 'Updated' });
      repository.update.mockResolvedValue(updated);

      const dto = { title: 'Updated' } as UpdateMovieDto;
      const result = await service.update(1, 5, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('should delete after ownership check', async () => {
      const movie = createMovie({ userId: 2 });
      repository.findById.mockResolvedValue(movie);

      await service.remove(1, 2);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
