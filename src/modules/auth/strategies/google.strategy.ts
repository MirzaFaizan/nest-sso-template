import { Strategy, Profile } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthEntity } from '../entities/auth.entity';
import { CustomConfigService } from '../../../config/config.service';
import { EmailProviders } from '../auth.constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: CustomConfigService,
  ) {
    super(configService.googleOptions);
  }

  validate(_at: string, _rt: string, profile: Profile): Promise<AuthEntity> {
    const email = profile.emails[0].value;
    const googleID = profile.id;
    const provider = EmailProviders.GOOGLE;

    return this.authService.findOrCreateSocialUser({
      email, googleID, provider, email_verified: true,
    });
  }
}
