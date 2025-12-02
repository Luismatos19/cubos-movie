/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';

import { MoviesController } from './movies.controller';
import { MoviesService } from '../application/services/movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should create movie', async () => {
    const dto = { title: 'Title' } as CreateMovieDto;
    const file = { originalname: 'poster.png' } as Express.Multer.File;
    mockService.create.mockResolvedValue('created');

    const result = await controller.create({ id: 1 }, file, dto);

    expect(service.create).toHaveBeenCalledWith(1, dto, file);
    expect(result).toBe('created');
  });

  it('should list movies', async () => {
    const query = { page: '1', limit: '10' };
    mockService.findAll.mockResolvedValue('list');

    const result = await controller.findAll({ id: 2 }, query);

    expect(service.findAll).toHaveBeenCalledWith(2, query);
    expect(result).toBe('list');
  });

  it('should get movie by id', async () => {
    mockService.findOne.mockResolvedValue('movie');

    const result = await controller.findOne(5, { id: 3 });

    expect(service.findOne).toHaveBeenCalledWith(5, 3);
    expect(result).toBe('movie');
  });

  it('should update movie', async () => {
    const dto = { title: 'updated' } as UpdateMovieDto;
    mockService.update.mockResolvedValue('updated');

    const result = await controller.update(6, { id: 4 }, dto);

    expect(service.update).toHaveBeenCalledWith(6, 4, dto);
    expect(result).toBe('updated');
  });

  it('should remove movie', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove(7, { id: 8 });

    expect(service.remove).toHaveBeenCalledWith(7, 8);
  });
});
