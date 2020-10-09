import { Strategy, Profile } from 'passport-linkedin-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthEntity } from '../entities/auth.entity';
import { CustomConfigService } from '../../../config/config.service';
import { EmailProviders } from '../auth.constants';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: CustomConfigService,
  ) {
    super(configService.linkedinOptions);
  }

  validate(_at: string, _rt: string, profile: Profile): Promise<AuthEntity> {
    const email = profile.emails[0].value;
    const linkedinID = profile.id;
    const provider = EmailProviders.LINKEDIN;

    return this.authService.findOrCreateSocialUser({
      email, provider, linkedinID, email_verified: true,
    });
  }
}
