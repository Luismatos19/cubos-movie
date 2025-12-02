import { Test, TestingModule } from '@nestjs/testing';
import { R2UploaderService } from './r2-uploader.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { r2Client } from '../../config/r2.client';

jest.mock('../../config/r2.client', () => ({
  r2Client: {
    send: jest.fn(),
  },
}));

describe('R2UploaderService', () => {
  let service: R2UploaderService;

  beforeEach(async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket';
    process.env.R2_ENDPOINT = 'http://r2.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [R2UploaderService],
    }).compile();

    service = module.get<R2UploaderService>(R2UploaderService);
    jest.clearAllMocks();
  });

  it('should upload image', async () => {
    const file = {
      originalname: 'test.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    (r2Client.send as jest.Mock).mockResolvedValue({});

    const result = await service.upload(file);

    expect(r2Client.send).toHaveBeenCalled();
    expect(result.url).toContain('http://r2.com/test-bucket/movies/');
    expect(result.url).toContain('.png');
  });

  it('should throw BadRequest if not image', async () => {
    const file = { mimetype: 'text/plain' } as Express.Multer.File;
    await expect(service.upload(file)).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerError on s3 error', async () => {
    const file = {
      originalname: 'test.png',
      mimetype: 'image/png',
      buffer: Buffer.from(''),
    } as Express.Multer.File;

    (r2Client.send as jest.Mock).mockRejectedValue(new Error('S3 error'));

    await expect(service.upload(file)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
