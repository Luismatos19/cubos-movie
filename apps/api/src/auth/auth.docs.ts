import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export const DocAuth = {
  Register: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Registrar novo usuário',
        description: 'Cria uma nova conta de usuário no sistema',
      }),
      ApiBody({ type: RegisterDto }),
      ApiResponse({
        status: 201,
        description: 'Usuário registrado com sucesso',
        schema: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      }),
      ApiResponse({
        status: 409,
        description: 'Email já está cadastrado',
      }),
      ApiResponse({
        status: 400,
        description: 'Dados inválidos fornecidos',
      }),
    ),

  Login: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Fazer login',
        description: 'Autentica um usuário e retorna um token JWT',
      }),
      ApiBody({ type: LoginDto }),
      ApiResponse({
        status: 200,
        description: 'Login realizado com sucesso',
        schema: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      }),
      ApiResponse({
        status: 401,
        description: 'Credenciais inválidas',
      }),
      ApiResponse({
        status: 400,
        description: 'Dados inválidos fornecidos',
      }),
    ),
};
