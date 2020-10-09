import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomConfigService } from './config.service';
import { envVarsValidationSchema as validationSchema } from './config.validation';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema,
    validationOptions: { allowUknown: false, abortEarly: true },
  })],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
