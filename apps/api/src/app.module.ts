import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
