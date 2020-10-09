import { DynamicModule } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { CustomConfigModule } from '../../config/config.module';
import { CustomConfigService } from '../../config/config.service';

export const Redis: DynamicModule = RedisModule.forRootAsync({
  imports: [CustomConfigModule],
  inject: [CustomConfigService],
  useFactory: (config: CustomConfigService): RedisModuleOptions => config.redisOptions,
});
