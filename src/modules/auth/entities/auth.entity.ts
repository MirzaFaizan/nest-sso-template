import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index, PrimaryColumn, Unique,
} from 'typeorm';
import { EmailProviders } from '../auth.constants';

@Index(['email', 'provider'])
@Unique(['email', 'provider'])
@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @CreateDateColumn()
  readonly created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @PrimaryColumn()
  email: string;

  @Column({ enum: EmailProviders })
  provider: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  linkedinID: string;

  @Column({ nullable: true })
  googleID: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  email_verification_token: string;

  @Column({ nullable: true })
  reset_password_token: string;
}
