import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
