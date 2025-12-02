import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should register user', async () => {
    const dto: RegisterDto = {
      name: 'Test',
      email: 't@t.com',
      password: 'p',
      confirmPassword: 'p',
    };
    mockAuthService.register.mockResolvedValue({ access_token: 'token' });

    const result = await controller.register(dto);

    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should login user', async () => {
    const dto: LoginDto = { email: 't@t.com', password: 'p' };
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });

    const result = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });
});
