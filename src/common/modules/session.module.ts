/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { RedisService } from 'nestjs-redis';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { CustomConfigModule } from '../../config/config.module';
import { CustomConfigService } from '../../config/config.service';
import { Redis } from './redis.module';

const RedisStore = connectRedis(session);

export const CustomSessionModule = SessionModule.forRootAsync({
  imports: [Redis, CustomConfigModule],
  inject: [RedisService, CustomConfigService],
  useFactory: (
    redisService: RedisService,
    config: CustomConfigService,
  ): NestSessionOptions => {
    const redisClient = redisService.getClient();
    const store = new RedisStore({ client: redisClient }) as session.Store;

    return {
      session: {
        secret: config.sessionSecret,
        store,
        resave: false,
        saveUninitialized: false,
      },
    };
  },
});
