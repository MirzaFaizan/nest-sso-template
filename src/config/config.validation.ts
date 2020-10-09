import * as Joi from 'joi';
import { Environments } from './config.constants';

export const envVarsValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(Environments.DEVELOPMENT, Environments.PRODUCTION, Environments.TEST)
    .required(),

  PORT: Joi.number().required(),

  DOMAIN_NAME: Joi.string().required(),
  CLIENT_PUBLIC_DOMAIN: Joi.string().required(),
  CLIENT_PUBLIC_DOMAIN_CALLBACK: Joi.string().required(),
  CLIENT_DASHBORD_DOMAIN: Joi.string().required(),
  CLIENT_DASHBORD_DOMAIN_CALLBACK: Joi.string().required(),
  CLIENT_ADMIN_DOMAIN: Joi.string().required(),
  CLIENT_ADMIN_DOMAIN_CALLBACK: Joi.string().required(),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  REDIS_PORT: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),

  SESSION_SECRET: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRY: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRY: Joi.string().required(),
  JWT_EMAIL_TOKEN_SECRET: Joi.string().required(),
  JWT_EMAIL_TOKEN_EXPIRY: Joi.string().required(),

  LINKEDIN_CLIENT_ID: Joi.string().required(),
  LINKEDIN_CLIENT_SECRET: Joi.string().required(),
  LINKEDIN_CALLBACK_URL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  SENDGRID_API_KEY: Joi.string().required(),
  NOTIFICATION_SENDER_EMAIL: Joi.string().required(),

  CRYPTO_KEY: Joi.string().required(),
  CRYPTO_VECTOR: Joi.string().required(),
});
