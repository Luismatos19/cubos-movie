import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar status da API',
    description: 'Retorna uma mensagem de boas-vindas da API',
  })
  @ApiResponse({
    status: 200,
    description: 'API está funcionando corretamente',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
