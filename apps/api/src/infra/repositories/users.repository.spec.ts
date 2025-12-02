/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../../config/prisma/prisma.service';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prisma: PrismaService;

  const mockDate = new Date();
  const mockPrismaUser = {
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    password: 'hash',
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser);

    const result = await repository.findByEmail('test@test.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
    expect(result?.email).toBe('test@test.com');
  });

  it('should return null if user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const result = await repository.findByEmail('notfound');
    expect(result).toBeNull();
  });

  it('should create user', async () => {
    mockPrisma.user.create.mockResolvedValue(mockPrismaUser);

    const result = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: 'hash',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test',
        email: 'test@test.com',
        password: 'hash',
      },
    });
    expect(result.id).toBe(1);
  });
});
