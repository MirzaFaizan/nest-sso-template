import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { CustomConfigService } from './config/config.service';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(CustomConfigService);

  app.useGlobalPipes(new ValidationPipe(config.validationPipeOptions));

  // limit each IP to 6 requests per second
  app.use(rateLimit({ windowMs: 1000, max: 6 }));
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser(config.sessionSecret));
  app.enableCors(config.corsOptions);

  await app.listen(config.port, () => {
    config.logger.verbose(`App is running on http://localhost:${config.port}!`, 'Main');
  });
}());
