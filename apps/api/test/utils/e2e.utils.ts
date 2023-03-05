import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { E2EEntities } from './entities';
import { ExerciseOptions } from '../../src/workouts/domain/entities/exercise-template/exercise-template.entity';

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export const createE2ETestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  return app;
};

export const createAppUser = async (
  app: INestApplication,
  email: string,
  password: string,
): Promise<E2EEntities.AppUser> => {
  const signUp = () =>
    new Promise<RegisterResponse>((resolve) => {
      request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email, password })
        .end((err, res) => {
          resolve(res.body);
        });
    });
  const { accessToken, refreshToken, userId } = await signUp();
  return { id: userId, email, accessToken, refreshToken };
};

export const createExerciseTemplate = async (
  app: INestApplication,
  user: E2EEntities.AppUser,
  name: string,
  options: ExerciseOptions,
): Promise<E2EEntities.ExerciseTemplate> => {
  const create = () =>
    new Promise<E2EEntities.ExerciseTemplate>((resolve) => {
      request(app.getHttpServer())
        .post('/workouts/exercises/templates')
        .send({ name, ...options })
        .set('Authorization', 'Bearer ' + user.accessToken)
        .end((err, res) => {
          const data = res.body;
          resolve(data);
        });
    });
  const template = await create();
  return template;
};
