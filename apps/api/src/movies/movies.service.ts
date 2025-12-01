import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '../config/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { r2Client } from '../config/r2.client';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private bucketName = process.env.R2_BUCKET_NAME!;

  constructor(private prisma: PrismaService) {}

  async uploadBufferToR2(
    originalName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens são permitidas');
    }

    const extension =
      this.getExtension(originalName) || this.getExtFromMime(mimeType) || 'png';
    const key = `movies/${uuid()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    try {
      await r2Client.send(command);

      const fileUrl = `${process.env.R2_ENDPOINT}/${this.bucketName}/${key}`;
      return { key, fileUrl };
    } catch (err) {
      console.error('R2 upload error', err);
      throw new InternalServerErrorException(
        'Erro ao enviar arquivo para storage',
      );
    }
  }

  async create(userId: number, createMovieDto: CreateMovieDto) {
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

  private getExtension(filename: string) {
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }

  private getExtFromMime(mime: string) {
    if (mime === 'image/jpeg') return 'jpg';
    if (mime === 'image/png') return 'png';
    if (mime === 'image/webp') return 'webp';
    if (mime === 'image/gif') return 'gif';
    return null;
  }
}
