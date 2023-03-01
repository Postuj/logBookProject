import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createAppUser,
  createE2ETestApp,
  createExerciseTemplate,
} from '../utils/e2e.utils';
import { E2EAppUser, E2EExerciseTemplate } from '../utils/entities';

describe('WorkoutTemplates (e2e)', () => {
  let app: INestApplication;
  let user: E2EAppUser;
  let exerciseTemplate: E2EExerciseTemplate;
  const uri = '/workout-templates';
  const email = 'user@mail.com';
  const password = 'password';
  const templateIds: string[] = [];

  let accessToken: string;

  beforeAll(async () => {
    app = await createE2ETestApp();
    user = await createAppUser(app, email, password);
    accessToken = 'Bearer ' + user.accessToken;
    exerciseTemplate = await createExerciseTemplate(app, user, 'testExercise', {
      hasRepetitions: true,
      hasWeight: true,
      hasTime: false,
    });
  });

  describe('Endpoints', () => {
    const name = 'test';
    const newName = 'newWorkoutTemplateName';

    describe('/workout-templates (POST)', () => {
      it('should allow user to create workout template without exercises', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({ name, exerciseTemplateIds: [] })
          .set('Authorization', accessToken)
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                createdById: user.id,
                name,
                exerciseTemplates: [],
              }),
            );
            templateIds.push(res.body.id);
            done();
          });
      });

      it('should not allow to create workout template with the same name', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({ name, exerciseTemplateIds: [] })
          .set('Authorization', accessToken)
          .expect(HttpStatus.FORBIDDEN, done);
      });

      it('should allow user to create workout template with exercises', (done) => {
        const templateName = 'testWithExercise';
        request(app.getHttpServer())
          .post(uri)
          .send({
            name: templateName,
            exerciseTemplateIds: [exerciseTemplate.id],
          })
          .set('Authorization', accessToken)
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                createdById: user.id,
                name: templateName,
                exerciseTemplates: [exerciseTemplate],
              }),
            );
            templateIds.push(res.body.id);
            done();
          });
      });
    });

    describe('/ (PATCH)', () => {
      it('should edit template', (done) => {
        request(app.getHttpServer())
          .patch(`${uri}/${templateIds[0]}`)
          .send({ name: newName, exerciseTemplateIds: [exerciseTemplate.id] })
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: templateIds[0],
                createdById: user.id,
                name: newName,
                exerciseTemplates: [exerciseTemplate],
              }),
            );
            done();
          });
      });
    });

    describe('/ (GET)', () => {
      it('should get list of templates', (done) => {
        request(app.getHttpServer())
          .get(uri)
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.arrayContaining([
                {
                  createdById: user.id,
                  id: templateIds[1],
                  name: 'testWithExercise',
                  exerciseTemplates: [exerciseTemplate],
                },
                {
                  createdById: user.id,
                  id: templateIds[0],
                  name: newName,
                  exerciseTemplates: [exerciseTemplate],
                },
              ]),
            );
            done();
          });
      });
    });

    describe('/ (DELETE)', () => {
      it('should delete template', (done) => {
        request(app.getHttpServer())
          .delete(`${uri}/${templateIds[1]}`)
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK, done);
      });
    });
  });
});
