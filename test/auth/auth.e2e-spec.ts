import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterLocalUserDto } from '../../src/modules/auth/dto/register-local-user.dto';
import { AuthModule } from '../../src/modules/auth/auth.module';

describe('[Feature] AuthEntity - /auth', () => {
  const user: RegisterLocalUserDto = {
    email: 'test@test.com',
    password: 'password',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    await app.init();
  });

  it('Register Local User, [POST /]', () => request(app.getHttpServer())
    .post('/auth/register')
    .send(user)
    .expect(HttpStatus.CREATED)
    .then(({ body }) => {
      expect(body).toMatchObject(user);
    }));

  afterAll(async () => {
    await app.close();
  });
});
