import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const errorMessage =
        'DATABASE_URL não está configurada. Verifique o arquivo .env';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const cleanUrl = databaseUrl.split('?')[0];
    const pool = new Pool({
      connectionString: cleanUrl,
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexão com o banco de dados estabelecida');
    } catch (error) {
      this.logger.error('Falha ao conectar ao banco de dados', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Conexão com o banco de dados fechada');
  }
}
