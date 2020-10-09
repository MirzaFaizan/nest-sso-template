import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomConfigService } from '../../config/config.service';
import { CustomConfigModule } from '../../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (config: CustomConfigService): TypeOrmModuleOptions => config.dbOptions,
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class DBModule {}
