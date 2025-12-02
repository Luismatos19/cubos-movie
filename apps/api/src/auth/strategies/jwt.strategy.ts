import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from '../../infra/repositories/users.repository';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado ou token inválido',
      );
    }

    return { id: user.id, email: user.email, name: user.name };
  }
}
