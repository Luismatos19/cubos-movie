import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

class SwaggerMovieResponse {
  @ApiProperty({ example: 1, description: 'ID do filme' })
  id: number;

  @ApiProperty({ example: 'Oppenheimer' })
  title: string;

  @ApiProperty({
    example: 'Biografia do físico J. Robert Oppenheimer.',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-07-21T00:00:00.000Z',
  })
  releaseDate: string;

  @ApiProperty({
    example: 'https://images.cubos-movie.com/oppenheimer.jpg',
  })
  imageUrl: string;

  @ApiProperty({ example: 14 })
  classification: number;

  @ApiProperty({ example: 92 })
  rating: number;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    nullable: true,
  })
  trailerUrl?: string | null;

  @ApiProperty({ example: 181 })
  duration: number;

  @ApiProperty({ example: 960000000 })
  revenue: number;

  @ApiProperty({ type: [String], example: ['Drama', 'Biografia'] })
  genres: string[];

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Data de criação',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Data de atualização',
  })
  updatedAt: string;
}

class SwaggerCreateMovieBody extends CreateMovieDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Poster do filme (obrigatório)',
  })
  file: string;
}

class SwaggerUpdateMovieBody extends UpdateMovieDto {}

const MovieIdParam = () =>
  ApiParam({
    name: 'id',
    description: 'Identificador do filme',
    type: Number,
    example: 1,
  });

export const DocMovies = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Criar filme',
        description: 'Cria um novo filme associado ao usuário autenticado.',
      }),
      ApiBody({ type: SwaggerCreateMovieBody }),
      ApiResponse({
        status: 201,
        description: 'Filme criado com sucesso.',
        type: SwaggerMovieResponse,
      }),
    ),
  List: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar filmes',
        description: 'Lista os filmes cadastrados pelo usuário autenticado.',
      }),
      ApiResponse({
        status: 200,
        description: 'Filmes retornados com sucesso.',
        type: SwaggerMovieResponse,
        isArray: true,
      }),
    ),
  GetOne: () =>
    applyDecorators(
      MovieIdParam(),
      ApiOperation({
        summary: 'Buscar filme por ID',
        description: 'Retorna os detalhes de um filme do usuário autenticado.',
      }),
      ApiResponse({
        status: 200,
        description: 'Filme encontrado.',
        type: SwaggerMovieResponse,
      }),
    ),
  Update: () =>
    applyDecorators(
      MovieIdParam(),
      ApiOperation({
        summary: 'Atualizar filme',
        description: 'Atualiza os dados de um filme existente.',
      }),
      ApiBody({ type: SwaggerUpdateMovieBody }),
      ApiResponse({
        status: 200,
        description: 'Filme atualizado com sucesso.',
        type: SwaggerMovieResponse,
      }),
    ),
  Remove: () =>
    applyDecorators(
      MovieIdParam(),
      ApiOperation({
        summary: 'Excluir filme',
        description: 'Remove um filme definitivamente.',
      }),
      ApiResponse({
        status: 204,
        description: 'Filme removido com sucesso.',
      }),
    ),
};
