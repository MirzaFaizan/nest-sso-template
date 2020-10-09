import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigModule } from '../config/config.module';
import { LoggedInGuard } from './guards/logged-in.guard';
import { CryptoService } from './services/crypto.service';
import { CustomJWTService } from './services/jwt.service';
import { EmailService } from './services/email.service';
import { DBModule } from './modules/db.module';
import { CustomSessionModule } from './modules/session.module';
import { BcryptService } from './services/bcrypt.service';

@Module({
  imports: [
    DBModule,
    CustomSessionModule,
    JwtModule.register({}),
    CustomConfigModule,
  ],
  providers: [
    BcryptService,
    EmailService,
    CryptoService,
    CustomJWTService,
    { provide: APP_GUARD, useClass: LoggedInGuard },
  ],
  exports: [CryptoService, CustomJWTService],
})
export class CommonModule {}
