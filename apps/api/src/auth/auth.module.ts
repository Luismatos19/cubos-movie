import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../config/prisma/prisma.module';
import { AuthService } from '../application/services/auth.service';
import { UsersRepository } from '../infra/repositories/users.repository';
import { BcryptService } from '../infra/security/bcrypt.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersRepository, BcryptService],
  exports: [AuthService],
})
export class AuthModule {}
