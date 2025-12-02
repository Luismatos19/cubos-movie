import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { MoviesService } from '../application/services/movies.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetMoviesDto } from './dto/get-movies.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { DocMovies } from './movies.doc';

type AuthUser = { id: number };

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (
        _req,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Apenas imagens são permitidas'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @DocMovies.Create()
  async create(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMovieDto,
  ) {
    return this.moviesService.create(user.id, body, file);
  }

  @Get()
  @DocMovies.List()
  findAll(@CurrentUser() user: AuthUser, @Query() query: GetMoviesDto) {
    return this.moviesService.findAll(user.id, query);
  }

  @Get(':id')
  @DocMovies.GetOne()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.moviesService.findOne(id, user.id);
  }

  @Patch(':id')
  @DocMovies.Update()
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, user.id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DocMovies.Remove()
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.moviesService.remove(id, user.id);
  }
}
