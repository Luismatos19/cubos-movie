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
}
