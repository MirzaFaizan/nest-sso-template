import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomConfigService } from '../../config/config.service';

interface AuthTokenPayloadType {
  uuid: string;
}

interface EmailTokenPayloadType {
  email: string;
}

@Injectable()
export class CustomJWTService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: CustomConfigService,
  ) {}

  public readonly BEARER_TEXT = 'Bearer ';

  createAccessToken(payload: AuthTokenPayloadType): string {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.jwtOptions.jwtAccessTokenSecret,
      expiresIn: this.configService.jwtOptions.jwtAccessTokenExpiry,
    });

    return this.BEARER_TEXT + token;
  }

  verifyAccessToken(jwtToken: string): AuthTokenPayloadType {
    const token = jwtToken.replace(this.BEARER_TEXT, '');

    const payload = this.jwtService.verify<AuthTokenPayloadType>(token, {
      secret: this.configService.jwtOptions.jwtAccessTokenSecret,
    });

    return payload;
  }

  createRefreshToken(payload: AuthTokenPayloadType): string {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.jwtOptions.jwtRefreshTokenSecret,
      expiresIn: this.configService.jwtOptions.jwtRefreshTokenExpiry,
    });

    return this.BEARER_TEXT + token;
  }

  verifyRefreshToken(jwtToken: string): AuthTokenPayloadType {
    const token = jwtToken.replace(this.BEARER_TEXT, '');

    const payload = this.jwtService.verify<AuthTokenPayloadType>(token, {
      secret: this.configService.jwtOptions.jwtRefreshTokenSecret,
    });

    return payload;
  }

  createEmailToken(payload: EmailTokenPayloadType): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.jwtOptions.jwtEmailTokenSecret,
      expiresIn: this.configService.jwtOptions.jwtEmailTokenExpiry,
    });
  }

  verifyEmailToken(token: string): EmailTokenPayloadType {
    return this.jwtService.verify<EmailTokenPayloadType>(token, {
      secret: this.configService.jwtOptions.jwtEmailTokenSecret,
    });
  }
}
