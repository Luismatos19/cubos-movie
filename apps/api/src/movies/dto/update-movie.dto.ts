import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @ApiPropertyOptional({
    description: 'Título do filme',
    example: 'O Poderoso Chefão',
    type: String,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(200, { message: 'Título deve ter no máximo 200 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição do filme',
    example: 'Um filme sobre a família Corleone',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Data de lançamento do filme',
    example: '1972-03-24',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de lançamento deve ser uma data válida' })
  releaseDate?: Date;
}
