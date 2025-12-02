import { Module } from '@nestjs/common';

import { PrismaModule } from '../config/prisma/prisma.module';
import { MoviesService } from '../application/services/movies.service';
import { MoviesRepository } from '../infra/repositories/movies.repository';
import { R2UploaderService } from '../infra/storage/r2-uploader.service';
import { MoviesController } from './movies.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository, R2UploaderService],
  exports: [MoviesService],
})
export class MoviesModule {}
