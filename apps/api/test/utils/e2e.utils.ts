import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { E2EAppUser, E2EExerciseTemplate } from './entities';
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
): Promise<E2EAppUser> => {
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
  return new E2EAppUser(userId, email, accessToken, refreshToken);
};

export const createExerciseTemplate = async (
  app: INestApplication,
  user: E2EAppUser,
  name: string,
  options: ExerciseOptions,
): Promise<E2EExerciseTemplate> => {
  const create = () =>
    new Promise<E2EExerciseTemplate>((resolve) => {
      request(app.getHttpServer())
        .post('/exercise-templates')
        .send({ name, ...options })
        .set('Authorization', 'Bearer ' + user.accessToken)
        .end((err, res) => {
          const data = res.body;
          resolve(
            new E2EExerciseTemplate(
              data.id,
              data.name,
              data.createdById,
              data.hasRepetitions,
              data.hasWeight,
              data.hasTime,
            ),
          );
        });
    });
  const template = await create();
  return template;
};
