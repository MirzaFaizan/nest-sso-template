import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsString({ message: 'Email is required!' })
  @IsEmail({}, { message: 'Invalid Email!' })
  @Transform((email: string) => email.toLowerCase())
  readonly email: string;
}
