/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, CookieOptions } from 'express';
import { AuthEntity } from '../modules/auth/entities/auth.entity';

export interface CookieType extends CookieOptions {
  serialize(name: string, value: string): string;
  originalMaxAge: number;
  path: string;
  maxAge: number;
  httpOnly: boolean;
  expires: Date;
}

export interface SessionType {
  id: string;
  regenerate(callback: (err: any) => void): void;
  destroy(callback: (err: any) => void): void;
  reload(callback: (err: any) => void): void;
  save(callback: (err: any) => void): void;
  touch(): void;
  cookie: CookieType;
  user?: AuthEntity;
}

export interface CustomRequestType extends Request {
  user?: AuthEntity;
  session?: SessionType;
}
