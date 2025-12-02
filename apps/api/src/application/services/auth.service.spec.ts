import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../../infra/repositories/users.repository';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../domain/user/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: UsersRepository;
  let bcrypt: BcryptService;
  let jwt: JwtService;

  const mockUser = new User({
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    name: 'Test',
  });

  const mockUsersRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepo },
        { provide: BcryptService, useValue: mockBcrypt },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepo = module.get<UsersRepository>(UsersRepository);
    bcrypt = module.get<BcryptService>(BcryptService);
    jwt = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUsersRepo.findByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashed');
      mockUsersRepo.create.mockResolvedValue({
        ...mockUser,
        password: 'hashed',
      });
      mockJwt.sign.mockReturnValue('token');

      const result = await service.register({
        name: 'Test',
        email: 'test@test.com',
        password: 'pass',
      });

      expect(usersRepo.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('pass');
      expect(usersRepo.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@test.com',
        password: 'hashed',
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ name: 'T', email: 'test@test.com', password: 'p' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login valid user', async () => {
      mockUsersRepo.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'pass',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hashedPassword');
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw Unauthorized if user not found', async () => {
      mockUsersRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'a', password: 'p' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if password invalid', async () => {
      mockUsersRepo.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);
      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
