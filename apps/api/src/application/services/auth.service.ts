import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from '../../infra/repositories/users.repository';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { RegisterDto } from '../../auth/dto/register.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import type { User } from '../../domain/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    this.logger.log(`Tentativa de registro para email: ${registerDto.email}`);

    const existingUser = await this.usersRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      this.logger.warn(
        `Tentativa de registro com email já cadastrado: ${registerDto.email}`,
      );
      throw new ConflictException('Este email já está cadastrado');
    }

    const hashedPassword = await this.passwordService.hash(
      registerDto.password,
    );

    const user = await this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    this.logger.log(`Usuário registrado com sucesso: ${user.id}`);

    return this.buildToken(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findByEmail(loginDto.email);

    if (!user) {
      this.logger.warn(
        `Tentativa de login com email não encontrado: ${loginDto.email}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `Tentativa de login com senha inválida para email: ${loginDto.email}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.buildToken(user);
  }

  private buildToken(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
