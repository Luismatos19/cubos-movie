import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: number, createMovieDto: CreateMovieDto) {
    this.logger.log(
      `Criando filme para usuário ${userId}: ${createMovieDto.title}`,
    );

    const movie = await this.prisma.movie.create({
      data: {
        ...createMovieDto,
        userId,
      },
    });

    this.logger.log(`Filme criado com sucesso: ${movie.id}`);
    return movie;
  }

  async findAll(userId: number) {
    this.logger.log(`Buscando todos os filmes do usuário ${userId}`);

    const movies = await this.prisma.movie.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    this.logger.log(
      `Encontrados ${movies.length} filmes para o usuário ${userId}`,
    );
    return movies;
  }

  async findOne(id: number, userId: number) {
    this.logger.log(`Buscando filme ${id} para usuário ${userId}`);

    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou acessar filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para acessar este filme',
      );
    }

    this.logger.log(`Filme ${id} encontrado com sucesso`);
    return movie;
  }

  async update(id: number, userId: number, updateMovieDto: UpdateMovieDto) {
    this.logger.log(`Atualizando filme ${id} para usuário ${userId}`);

    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado para atualização`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou editar filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para editar este filme',
      );
    }

    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });

    this.logger.log(`Filme ${id} atualizado com sucesso`);
    return updatedMovie;
  }

  async remove(id: number, userId: number) {
    this.logger.log(`Excluindo filme ${id} para usuário ${userId}`);

    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      this.logger.warn(`Filme ${id} não encontrado para exclusão`);
      throw new NotFoundException('Filme não encontrado');
    }

    if (movie.userId !== userId) {
      this.logger.warn(
        `Usuário ${userId} tentou excluir filme ${id} de outro usuário`,
      );
      throw new ForbiddenException(
        'Você não tem permissão para excluir este filme',
      );
    }

    await this.prisma.movie.delete({
      where: { id },
    });

    this.logger.log(`Filme ${id} excluído com sucesso`);
  }
}
