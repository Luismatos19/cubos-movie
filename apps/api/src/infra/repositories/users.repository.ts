import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../config/prisma/prisma.service';
import { User } from '../../domain/user/user.entity';
import { UserMapper } from '../mappers/user.mapper';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return UserMapper.toDomain(user);
  }
}
