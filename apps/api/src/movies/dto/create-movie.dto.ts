import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Date)
  @IsDate({ message: 'Data de lançamento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de lançamento é obrigatória' })
  releaseDate: Date;
}
