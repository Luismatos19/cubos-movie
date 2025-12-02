import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import type { TransformFnParams } from 'class-transformer';

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return new Date('');
};

const toNumberArray = (value: unknown): number[] | undefined => {
  if (value === undefined || value === null || value === '') return undefined;

  if (Array.isArray(value)) {
    const arr = value
      .map((item) => Number(item))
      .filter((num) => !Number.isNaN(num));
    return arr.length ? arr : undefined;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        const arr = parsed
          .map((item) => Number(item))
          .filter((num) => !Number.isNaN(num));
        return arr.length ? arr : undefined;
      }
    } catch {
      const arr = value
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((num) => !Number.isNaN(num));
      return arr.length ? arr : undefined;
    }
  }

  return undefined;
};

export class CreateMovieDto {
  @ApiProperty({
    description: 'Título do filme',
    example: 'O Poderoso Chefão',
    type: String,
    maxLength: 200,
  })
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @MaxLength(200, { message: 'Título deve ter no máximo 200 caracteres' })
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição do filme',
    example: 'Um filme sobre a família Corleone',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Data de lançamento do filme',
    example: '1972-03-24',
    type: String,
    format: 'date',
  })
  @Transform(({ value }: TransformFnParams) => toDate(value as unknown))
  @IsDate({ message: 'Data de lançamento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de lançamento é obrigatória' })
  releaseDate: Date;

  @ApiPropertyOptional({
    description: 'URL da imagem do filme',
    example: 'https://example.com/image.jpg',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'URL da imagem deve ser uma string' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Classificação indicativa (0 a 18)',
    example: 14,
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => toNumber(value as unknown))
  @IsOptional()
  @IsInt({ message: 'Classificação deve ser um número inteiro' })
  @Min(0, { message: 'Classificação deve ser no mínimo 0' })
  @Max(18, { message: 'Classificação deve ser no máximo 18' })
  classification?: number = 0;

  @ApiPropertyOptional({
    description: 'Rating (0 a 100)',
    example: 82,
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => toNumber(value as unknown))
  @IsOptional()
  @IsInt({ message: 'Rating deve ser um número inteiro' })
  @Min(0, { message: 'Rating deve ser no mínimo 0' })
  @Max(100, { message: 'Rating deve ser no máximo 100' })
  rating?: number = 0;

  @ApiPropertyOptional({
    description: 'URL do trailer',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsOptional()
  @IsString({ message: 'O trailer deve ser uma URL válida' })
  trailerUrl?: string;

  @ApiPropertyOptional({
    description: 'Duração em minutos',
    example: 145,
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => toNumber(value as unknown))
  @IsOptional()
  @IsInt({ message: 'Duração deve ser um número inteiro' })
  @Min(0, { message: 'Duração deve ser no mínimo 0 minutos' })
  duration?: number = 0;

  @ApiPropertyOptional({
    description: 'Receita em dólares',
    example: 150000000,
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => toNumber(value as unknown))
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Receita deve ser um número com até duas casas decimais' },
  )
  @Min(0, { message: 'Receita deve ser no mínimo 0' })
  revenue?: number = 0;

  @ApiPropertyOptional({
    description: 'IDs dos gêneros associados',
    type: [Number],
    example: [1, 2, 5],
  })
  @IsOptional()
  @IsArray({ message: 'Gêneros deve ser um array' })
  @ArrayNotEmpty({ message: 'Informe pelo menos um gênero' })
  @Transform(({ value }: TransformFnParams) => toNumberArray(value as unknown))
  @IsInt({ each: true, message: 'Cada gênero deve ser um número inteiro' })
  genreIds?: number[];
}
