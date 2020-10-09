/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class BcryptService {
  public createHash(text: string): string {
    return hashSync(text);
  }

  public compareHash(text: string, hash: string): boolean {
    return compareSync(text, hash);
  }
}
