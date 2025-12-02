import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

import { r2Client } from '../../config/r2.client';

type UploadedFile = Express.Multer.File;

@Injectable()
export class R2UploaderService {
  private readonly bucketName = process.env.R2_BUCKET_NAME!;

  async upload(file: UploadedFile) {
    this.assertImage(file);

    const extension = this.getExtension(file.originalname);
    const key = `movies/${uuid()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await r2Client.send(command);

      return {
        key,
        url: `${process.env.R2_ENDPOINT}/${this.bucketName}/${key}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar arquivo para storage',
        { cause: error as Error },
      );
    }
  }

  private assertImage(file: UploadedFile) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Apenas imagens são permitidas');
    }
  }

  private getExtension(filename: string) {
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : 'png';
  }
}
