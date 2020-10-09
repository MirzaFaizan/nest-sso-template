import {
  ConflictException, Injectable, InternalServerErrorException,
  NotImplementedException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BcryptService } from '../../common/services/bcrypt.service';
import { CryptoService } from '../../common/services/crypto.service';
import { CustomJWTService } from '../../common/services/jwt.service';
import { CustomConfigService } from '../../config/config.service';
import { RegisterLocalUserDto } from './dto/register-local-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthEntity } from './entities/auth.entity';
import { EmailProviders } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    public readonly bcryptService: BcryptService,
    private readonly configService: CustomConfigService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: CustomJWTService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthEntity> {
    const error = new UnauthorizedException('Email & Password combination is incorrect!');

    const user = await this.authRepository.findOne({ email, provider: EmailProviders.LOCAL });
    if (!user) throw error;

    if (!this.bcryptService.compareHash(password, user.password)) throw error;

    return user;
  }

  login(user: AuthEntity): { accessToken: string; refreshToken: string; uuid: string } {
    const uuid = this.cryptoService.encrypt(`${user.id}`);
    const payload = { uuid };

    const accessToken = this.jwtService.createAccessToken(payload);

    const refreshToken = this.jwtService.createRefreshToken(payload);

    return { accessToken, refreshToken, uuid };
  }

  async registerLocalUser({
    email, password,
  }: RegisterLocalUserDto): Promise<{ user: AuthEntity; link: string }> {
    const provider = EmailProviders.LOCAL;

    const userExists = await this.authRepository.findOne({ email, provider });
    if (userExists) throw new ConflictException('Email already exists!');

    const emailVerificationToken = this.jwtService.createEmailToken({ email });

    const newUser = this.authRepository.create({
      email,
      provider,
      password: this.bcryptService.createHash(password),
      email_verified: false,
      email_verification_token: emailVerificationToken,
    });

    const user = await this.authRepository.save(newUser);
    if (!user) throw new NotImplementedException('Unable to register user!');

    const link = `${this.configService.apps.dashboard.domain}/verifyEmail?token=${emailVerificationToken}`;

    return { user, link };
  }

  verifyRefreshToken(token: string, uuid: string): number {
    const payload = this.jwtService.verifyRefreshToken(token);
    if (payload.uuid !== uuid) throw new UnauthorizedException();

    const id = +this.cryptoService.decrypt(uuid);

    return id;
  }

  async findOrCreateSocialUser(user: DeepPartial<AuthEntity>): Promise<AuthEntity> {
    const { email, provider } = user;

    const existingUser = await this.authRepository.findOne({ email, provider });
    if (existingUser) return existingUser;

    const newUser = this.authRepository.create(user);

    return this.authRepository.save(newUser);
  }

  async verifyAccountFromToken(token: string): Promise<void> {
    const { email } = this.jwtService.verifyEmailToken(token);
    const provider = EmailProviders.LOCAL;

    const user = await this.authRepository.update(
      { email, provider, email_verification_token: token },
      { email_verified: true, email_verification_token: null },
    );
    if (!user || user.affected === 0) throw new InternalServerErrorException();
  }

  async forgotPassword(email: string): Promise<string> {
    const provider = EmailProviders.LOCAL;
    const resetPasswordToken = this.jwtService.createEmailToken({ email });

    const user = await this.authRepository.update(
      { email, provider },
      { reset_password_token: resetPasswordToken },
    );
    if (!user || user.affected === 0) throw new UnauthorizedException('Email does not exist!');

    return `${this.configService.apps.dashboard.domain}/resetPassword?token=${resetPasswordToken}`;
  }

  async resetPasswordFromToken({ token, password }: ResetPasswordDto): Promise<string> {
    const { email } = this.jwtService.verifyEmailToken(token);
    const provider = EmailProviders.LOCAL;

    const user = await this.authRepository.update(
      { email, provider, reset_password_token: token },
      {
        email_verified: true,
        email_verification_token: null,
        reset_password_token: null,
        password: this.bcryptService.createHash(password),
      },
    );
    if (!user || user.affected === 0) throw new InternalServerErrorException();

    return email;
  }
}
