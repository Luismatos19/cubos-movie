import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo filme',
    description: 'Cria um novo filme associado ao usuário autenticado',
  })
  @ApiBody({ type: CreateMovieDto })
  create(
    @CurrentUser() user: { id: number },
    @Body() createMovieDto: CreateMovieDto,
  ) {
    return this.moviesService.create(user.id, createMovieDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os filmes',
    description: 'Retorna todos os filmes do usuário autenticado',
  })
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
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.moviesService.remove(id, user.id);
  }
}
