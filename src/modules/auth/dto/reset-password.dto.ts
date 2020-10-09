import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Token is required!' })
  readonly token: string;

  @IsString({ message: 'Password is required!' })
  readonly password: string;
}
