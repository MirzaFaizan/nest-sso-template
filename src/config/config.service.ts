import { Injectable, ValidationPipeOptions, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions } from 'nestjs-redis';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { CookieOptions } from 'express';
import {
  AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN, Environments, SupportedApps,
} from './config.constants';

@Injectable()
export class CustomConfigService {
  public readonly logger = new Logger();

  public readonly nodeEnv = process.env.NODE_ENV;

  public readonly isProduction = this.nodeEnv === Environments.PRODUCTION;

  public readonly port = process.env.PORT;

  public readonly domainName = process.env.DOMAIN_NAME;

  public readonly apps: Record<SupportedApps, { domain: string; callback: string }> = {
    public: {
      domain: process.env.CLIENT_PUBLIC_DOMAIN.toLowerCase(),
      callback: process.env.CLIENT_PUBLIC_DOMAIN_CALLBACK.toLowerCase(),
    },
    dashboard: {
      domain: process.env.CLIENT_DASHBORD_DOMAIN.toLowerCase(),
      callback: process.env.CLIENT_DASHBORD_DOMAIN_CALLBACK.toLowerCase(),
    },
    admin: {
      domain: process.env.CLIENT_ADMIN_DOMAIN.toLowerCase(),
      callback: process.env.CLIENT_ADMIN_DOMAIN_CALLBACK.toLowerCase(),
    },
  };

  public readonly sessionSecret = process.env.SESSION_SECRET;

  public readonly dbOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: false,
  };

  public readonly redisOptions: RedisModuleOptions = {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  };

  public readonly jwtOptions = {
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    jwtEmailTokenSecret: process.env.JWT_EMAIL_TOKEN_SECRET,
    jwtEmailTokenExpiry: process.env.JWT_EMAIL_TOKEN_EXPIRY,
  };

  public readonly cryptoOptions = {
    algorithm: 'aes-256-cbc',
    key: process.env.CRYPTO_KEY,
    vector: process.env.CRYPTO_VECTOR,
  };

  public readonly corsOptions: CorsOptions = {
    origin: [
      this.apps.admin.domain,
      this.apps.dashboard.domain,
      this.apps.public.domain,
    ],
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN],
    credentials: true,
  };

  public readonly validationPipeOptions: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  };

  public readonly cookieOptions: CookieOptions = {
    domain: this.domainName,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: this.isProduction,
  };

  public readonly linkedinOptions = {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile'],
  };

  public readonly googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
  };

  public readonly sendGridApiKey = process.env.SENDGRID_API_KEY;

  public readonly senderEmails = {
    notificationEmail: process.env.NOTIFICATION_SENDER_EMAIL,
  };
}
