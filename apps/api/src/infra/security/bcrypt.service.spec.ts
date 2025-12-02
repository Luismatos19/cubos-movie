import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should hash password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const result = await service.hash('password');
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(result).toBe('hashed');
  });

  it('should compare password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.compare('pass', 'hash');
    expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hash');
    expect(result).toBe(true);
  });
});
