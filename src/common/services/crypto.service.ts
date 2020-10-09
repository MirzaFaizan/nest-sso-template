import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { CustomConfigService } from '../../config/config.service';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: CustomConfigService) {}

  encrypt = (value: string): string => {
    const cipher = createCipheriv(
      this.configService.cryptoOptions.algorithm,
      this.configService.cryptoOptions.key,
      this.configService.cryptoOptions.vector,
    );

    let encrypted = cipher.update(value, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return encrypted;
  };

  decrypt = (encrypted: string): string => {
    const decipher = createDecipheriv(
      this.configService.cryptoOptions.algorithm,
      this.configService.cryptoOptions.key,
      this.configService.cryptoOptions.vector,
    );

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  };
}
