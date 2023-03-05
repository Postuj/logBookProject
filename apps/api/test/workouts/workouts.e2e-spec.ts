import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createAppUser,
  createE2ETestApp,
  createExerciseTemplate,
} from '../utils/e2e.utils';
import { E2EEntities } from '../utils/entities';

describe('Workouts (e2e)', () => {
  let app: INestApplication;
  let user: E2EEntities.AppUser;
  let exerciseTemplates: E2EEntities.ExerciseTemplate[];
  const uri = '/workouts';
  const email = 'user@mail.com';
  const password = 'password';

  let accessToken: string;

  beforeAll(async () => {
    app = await createE2ETestApp();
    user = await createAppUser(app, email, password);
    accessToken = 'Bearer ' + user.accessToken;
    exerciseTemplates = [];
    exerciseTemplates.push(
      await createExerciseTemplate(app, user, 'plank', {
        hasRepetitions: false,
        hasWeight: false,
        hasTime: true,
      }),
    );
    exerciseTemplates.push(
      await createExerciseTemplate(app, user, 'flatBenchPress', {
        hasRepetitions: true,
        hasWeight: true,
        hasTime: false,
      }),
    );
  });

  describe('Endpoints (/workouts)', () => {
    const workouts: E2EEntities.Workout[] = [];
    const name = 'test';
    const newName = 'newWorkoutName';
    const secondWorkoutName = 'secondWorkoutName';

    describe('/ (POST)', () => {
      it('should allow user to create workout without exercises', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({ name, exercises: [] })
          .set('Authorization', accessToken)
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                finishedAt: expect.any(String),
                createdById: user.id,
                name,
                exercises: [],
                templateId: null,
              }),
            );
            workouts.push(res.body);
            done();
          });
      });

      it('should allow user to create workout with exercises', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({
            name: secondWorkoutName,
            exercises: [
              {
                templateId: exerciseTemplates[0].id,
                series: [{ seconds: 120 }, { seconds: 120 }],
              },
              {
                templateId: exerciseTemplates[1].id,
                series: [
                  { weight: 80.5, repetitions: 10 },
                  { weight: 86, repetitions: 8 },
                ],
              },
            ],
          })
          .set('Authorization', accessToken)
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                createdById: user.id,
                name: secondWorkoutName,
                finishedAt: expect.any(String),
                templateId: null,
                exercises: expect.arrayContaining([
                  {
                    id: expect.any(String),
                    templateId: exerciseTemplates[0].id,
                    name: 'plank',
                    hasRepetitions: false,
                    hasWeight: false,
                    hasTime: true,
                    series: [
                      {
                        id: expect.any(String),
                        repetitions: null,
                        weight: null,
                        seconds: 120,
                      },
                      {
                        id: expect.any(String),
                        repetitions: null,
                        weight: null,
                        seconds: 120,
                      },
                    ],
                  },
                  {
                    id: expect.any(String),
                    templateId: exerciseTemplates[1].id,
                    name: 'flatBenchPress',
                    hasRepetitions: true,
                    hasWeight: true,
                    hasTime: false,
                    series: [
                      {
                        id: expect.any(String),
                        repetitions: 10,
                        weight: 80.5,
                        seconds: null,
                      },
                      {
                        id: expect.any(String),
                        repetitions: 8,
                        weight: 86,
                        seconds: null,
                      },
                    ],
                  },
                ]),
              }),
            );
            workouts.push(res.body);
            done();
          });
      });
    });

    describe('/ (PATCH)', () => {
      it('should edit workout', (done) => {
        request(app.getHttpServer())
          .patch(`${uri}/${workouts[0].id}`)
          .send({
            name: newName,
            exercises: [
              {
                name: 'plank',
                hasRepetitions: false,
                hasWeight: false,
                hasTime: true,
                templateId: exerciseTemplates[0].id,
                series: [{ seconds: 120 }, { seconds: 120 }],
              },
            ],
          })
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: workouts[0].id,
                templateId: null,
                createdById: user.id,
                name: newName,
                finishedAt: workouts[0].finishedAt,
                exercises: [
                  {
                    id: expect.any(String),
                    templateId: exerciseTemplates[0].id,
                    name: 'plank',
                    hasRepetitions: false,
                    hasWeight: false,
                    hasTime: true,
                    series: [
                      {
                        id: expect.any(String),
                        repetitions: null,
                        weight: null,
                        seconds: 120,
                      },
                      {
                        id: expect.any(String),
                        repetitions: null,
                        weight: null,
                        seconds: 120,
                      },
                    ],
                  },
                ],
              }),
            );
            workouts[0] = res.body;
            done();
          });
      });
    });

    describe('/ (GET)', () => {
      it('should get list of workouts', (done) => {
        request(app.getHttpServer())
          .get(uri)
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(expect.arrayContaining(workouts));
            done();
          });
      });
    });

    describe('/ (DELETE)', () => {
      it('should delete template', (done) => {
        request(app.getHttpServer())
          .delete(`${uri}/${workouts[0].id}`)
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK, done);
      });
    });
  });
});
