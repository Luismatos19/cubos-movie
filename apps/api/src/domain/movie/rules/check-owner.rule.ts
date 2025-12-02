import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { Movie } from '../movie.entity';

export class CheckOwnerRule {
  static ensure(movie: Movie | null, userId: number) {
    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }
    if (movie.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este filme',
      );
    }
  }
}
