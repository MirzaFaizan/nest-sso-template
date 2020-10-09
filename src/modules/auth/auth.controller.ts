/* eslint-disable class-methods-use-this */
import {
  Controller, Post, Body, UseGuards, Req, UnauthorizedException, Get, Res, Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from '../../config/config.constants';
import { PublicRoute } from '../../common/decorators/public-route.decorator';
import { CustomRequestType } from '../../common/common.types';
import { CustomConfigService } from '../../config/config.service';
import { EmailService } from '../../common/services/email.service';
import { RegisterLocalUserDto } from './dto/register-local-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LinkedinAuthGuard } from './guards/linkedin-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: CustomConfigService,
    private readonly emailService: EmailService,
  ) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  loginApi(@Req() req: CustomRequestType, @Res() res: Response): void {
    try {
      if (!req.user) throw new UnauthorizedException();

      req.session.user = req.user;

      const { accessToken, refreshToken, uuid } = this.authService.login(req.user);

      res
        .set(AUTH_ACCESS_TOKEN, accessToken)
        .set(AUTH_REFRESH_TOKEN, refreshToken)
        .cookie('uuid', uuid, this.config.cookieOptions)
        .status(200)
        .send({ uuid });
    } catch (err) {
      this.config.logger.error(err);
      throw new UnauthorizedException(err);
    }
  }

  @PublicRoute()
  @UseGuards(LinkedinAuthGuard)
  @Get('/auth/linkedin')
  linkedin(): void {}

  @PublicRoute()
  @UseGuards(LinkedinAuthGuard)
  @Get('/auth/linkedin/callback')
  linkedinCallback(@Req() req: CustomRequestType, @Res() res: Response): void {
    try {
      if (!req.user) throw new UnauthorizedException();

      req.session.user = req.user;

      res.redirect(this.config.apps.dashboard.domain);
    } catch (err) {
      this.config.logger.error(err);
      throw new UnauthorizedException(err);
    }
  }

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get('/auth/google')
  google(): void {}

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get('/auth/google/callback')
  googleCallback(@Req() req: CustomRequestType, @Res() res: Response): void {
    try {
      if (!req.user) throw new UnauthorizedException();

      req.session.user = req.user;

      res.redirect(this.config.apps.dashboard.domain);
    } catch (err) {
      this.config.logger.error(err);
      throw new UnauthorizedException(err);
    }
  }

  @Get('auth/logout')
  logout(@Req() req: CustomRequestType, @Res() res: Response): void {
    res.clearCookie('uuid');
    req.session.destroy((err) => this.config.logger.error(err, 'AuthController'));

    res.send();
  }

  @PublicRoute()
  @Post('auth/register')
  async registerLocalUser(@Body() registerLocalUserDto: RegisterLocalUserDto): Promise<void> {
    const { user, link } = await this.authService.registerLocalUser(registerLocalUserDto);

    await this.emailService.sendAccountVerificationEmail({ to: user.email, link });
  }

  @PublicRoute()
  @Get('auth/exchangeTokens')
  exchangeTokens(@Req() req: CustomRequestType, @Res() res: Response): void {
    try {
      if (!req.session?.user) throw new UnauthorizedException();

      const token = req.headers.authorization;

      const { uuid } = req.cookies as { uuid?: string } || {};

      const id = this.authService.verifyRefreshToken(token, uuid);
      if (req.session.user.id !== id) throw new UnauthorizedException();

      const { accessToken, refreshToken } = this.authService.login(req.session.user);

      res
        .set(AUTH_ACCESS_TOKEN, accessToken)
        .set(AUTH_REFRESH_TOKEN, refreshToken)
        .cookie('uuid', uuid, this.config.cookieOptions)
        .status(200)
        .send({ uuid });
    } catch (err) {
      this.config.logger.error(err);
      throw new UnauthorizedException();
    }
  }

  @PublicRoute()
  @Get('auth/shakeHands')
  shakeHands(@Req() req: CustomRequestType, @Res() res: Response): Response {
    try {
      if (req.session?.user) {
        const { accessToken, refreshToken, uuid } = this.authService.login(req.session.user);

        return res
          .set(AUTH_ACCESS_TOKEN, accessToken)
          .set(AUTH_REFRESH_TOKEN, refreshToken)
          .cookie('uuid', uuid, this.config.cookieOptions)
          .status(200)
          .send({ uuid });
      }
    } catch (err) {
      this.config.logger.error(err);
    }
    return res.status(200).send();
  }

  @PublicRoute()
  @Get('auth/verifyEmail')
  verifyEmail(@Query() { token }: { token?: string }): Promise<void> {
    if (!token) throw new UnauthorizedException();

    return this.authService.verifyAccountFromToken(token);
  }

  @PublicRoute()
  @Post('auth/forgotPassword')
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    const link = await this.authService.forgotPassword(email);

    await this.emailService.resetPasswordEmail({ to: email, link });
  }

  @PublicRoute()
  @Post('auth/resetPassword')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    const email = await this.authService.resetPasswordFromToken(body);

    await this.emailService.confirmationResetPasswordEmail(email);
  }
}
