import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { BcryptService } from '../../common/services/bcrypt.service';
import { CommonModule } from '../../common/common.module';
import { EmailService } from '../../common/services/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { CustomConfigModule } from '../../config/config.module';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    CustomConfigModule,
    PassportModule,
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    EmailService,
    GoogleStrategy,
    LocalStrategy,
    LinkedinStrategy,
  ],
})
export class AuthModule {}
