import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Apenas imagens são permitidas') as any,
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  async create(
    @CurrentUser() user: { id: number },
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description?: string; releaseDate: Date },
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório');

    const { fileUrl } = await this.moviesService.uploadBufferToR2(
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    const movie = await this.moviesService.create(user.id, {
      title: body.title,
      description: body.description,
      imageUrl: fileUrl,
      releaseDate: body.releaseDate,
    });

    return movie;
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os filmes',
    description: 'Retorna todos os filmes do usuário autenticado',
  })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: { id: number }) {
    return this.moviesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar filme por ID',
    description: 'Retorna um filme específico do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do filme',
    type: Number,
    example: 1,
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.moviesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar filme',
    description: 'Atualiza um filme específico do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do filme',
    type: Number,
    example: 1,
  })
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, user.id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir filme',
    description: 'Exclui um filme específico do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do filme',
    type: Number,
    example: 1,
  })
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.moviesService.remove(id, user.id);
  }
}
