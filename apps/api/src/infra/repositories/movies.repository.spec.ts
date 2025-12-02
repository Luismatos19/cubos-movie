/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRepository } from './movies.repository';
import { PrismaService } from '../../config/prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('MoviesRepository', () => {
  let repository: MoviesRepository;
  let prisma: PrismaService;

  const mockDate = new Date();
  const mockPrismaMovie = {
    id: 1,
    title: 'Movie',
    description: 'Desc',
    releaseDate: mockDate,
    imageUrl: 'img.jpg',
    classification: 12,
    rating: 80,
    trailerUrl: 'url',
    duration: 120,
    revenue: new Prisma.Decimal(1000),
    userId: 1,
    createdAt: mockDate,
    updatedAt: mockDate,
    genres: [{ genre: { name: 'Action' } }],
  };

  const mockPrisma = {
    movie: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    movieGenre: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<MoviesRepository>(MoviesRepository);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should find all movies', async () => {
    mockPrisma.movie.count.mockResolvedValue(1);
    mockPrisma.movie.findMany.mockResolvedValue([mockPrismaMovie]);

    const result = await repository.findAll(1, { page: 1, limit: 10 });

    expect(prisma.movie.count).toHaveBeenCalled();
    expect(prisma.movie.findMany).toHaveBeenCalled();
    expect(result.movies[0].title).toBe('Movie');
    expect(result.total).toBe(1);
  });

  it('should find by id', async () => {
    mockPrisma.movie.findUnique.mockResolvedValue(mockPrismaMovie);

    const result = await repository.findById(1);

    expect(prisma.movie.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
    expect(result?.id).toBe(1);
  });

  it('should create movie', async () => {
    mockPrisma.movie.create.mockResolvedValue(mockPrismaMovie);

    const result = await repository.create(1, {
      title: 'New',
      releaseDate: new Date(),
      imageUrl: 'img.jpg',
    });

    expect(prisma.movie.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should update movie', async () => {
    mockPrisma.movie.update.mockResolvedValue(mockPrismaMovie);

    const result = await repository.update(1, { title: 'Updated' });

    expect(prisma.movie.update).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should delete movie', async () => {
    mockPrisma.movieGenre.deleteMany.mockResolvedValue({ count: 1 });
    mockPrisma.movie.delete.mockResolvedValue(mockPrismaMovie);

    await repository.delete(1);

    expect(prisma.movieGenre.deleteMany).toHaveBeenCalledWith({
      where: { movieId: 1 },
    });
    expect(prisma.movie.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
