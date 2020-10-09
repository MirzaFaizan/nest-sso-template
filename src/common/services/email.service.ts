import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { CustomConfigService } from '../../config/config.service';

interface EmailVerifyType {
  to: string;
  link: string;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: CustomConfigService,
  ) {
    sgMail.setApiKey(configService.sendGridApiKey);
    configService.logger.setContext('EmailService');
  }

  private readonly notificationEmail = this.configService.senderEmails.notificationEmail;

  public async sendAccountVerificationEmail({ to, link }: EmailVerifyType): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: this.notificationEmail,
        subject: 'InnovationsCity: Verify Your Email',
        html: `
          <p>Please <a href=${link}>click here</a> to verify your account<p>
        `,
      });

      this.configService.logger.log('Account verification email sent successfully!');
    } catch (err) {
      this.configService.logger.error(err);
    }
  }

  public async resetPasswordEmail({ to, link }: EmailVerifyType): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: this.notificationEmail,
        subject: 'InnovationsCity: Reset Password Request',
        html: `
          <p>Please <a href=${link}>click here</a> to reset your password.<p>
        `,
      });

      this.configService.logger.log('Reset password email sent successfully!');
    } catch (err) {
      this.configService.logger.error(err);
    }
  }

  public async confirmationResetPasswordEmail(to: string): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: this.notificationEmail,
        subject: 'InnovationsCity: Password Update Successfully!',
        html: `
          <p>You have successfully reset your password!<p>
        `,
      });

      this.configService.logger.log('Confirm reset password email sent successfully!');
    } catch (err) {
      this.configService.logger.error(err);
    }
  }
}
