import type { User as PrismaUser } from '@prisma/client';

import { User } from '../../domain/user/user.entity';

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
