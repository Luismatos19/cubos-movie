import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetMoviesDto {
  @ApiPropertyOptional({
    description: 'Página',
    example: '1',
    type: Number,
  })
  @IsNumberString()
  @IsOptional()
  page?: string = '1';

  @ApiPropertyOptional({
    description: 'Limite',
    example: '10',
    type: Number,
  })
  @IsNumberString()
  @IsOptional()
  limit?: string = '10';

  @ApiPropertyOptional({
    description: 'Busca',
    example: 'O Poderoso Chefão',
    type: String,
  })
  @IsString()
  @IsOptional()
  search?: string = '';

  @ApiPropertyOptional({
    description: 'Duração mínima (minutos)',
    example: '90',
    type: Number,
  })
  @IsOptional()
  minDuration?: number;

  @ApiPropertyOptional({
    description: 'Duração máxima (minutos)',
    example: '180',
    type: Number,
  })
  @IsOptional()
  maxDuration?: number;

  @ApiPropertyOptional({
    description: 'Data de lançamento inicial (ISO 8601)',
    example: '2020-01-01',
    type: String,
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de lançamento final (ISO 8601)',
    example: '2023-12-31',
    type: String,
  })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Gênero',
    example: 'Ação',
    type: String,
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Classificação indicativa máxima',
    example: '16',
    type: Number,
  })
  @IsOptional()
  maxClassification?: number;
}
