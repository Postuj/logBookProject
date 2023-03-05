import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppUser, createE2ETestApp } from '../utils/e2e.utils';
import { E2EEntities } from '../utils/entities';

describe('ExerciseTemplates (e2e)', () => {
  let app: INestApplication;
  let user: E2EEntities.AppUser;

  let templateId: string;
  let accessToken: string;
  const email = 'user@mail.com';
  const password = 'password';
  const uri = '/workouts/exercises/templates';

  beforeAll(async () => {
    app = await createE2ETestApp();
    user = await createAppUser(app, email, password);
    accessToken = 'Bearer ' + user.accessToken;
  });

  describe('Endpoints (/workouts/exercises/templates)', () => {
    const name = 'test';
    const newName = 'newExerciseTemplateName';

    describe('/ (POST)', () => {
      it('should allow user to create exercise template', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({ name, hasRepetitions: true, hasWeight: true, hasTime: false })
          .set('Authorization', accessToken)
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                createdById: user.id,
                name,
                hasRepetitions: true,
                hasWeight: true,
                hasTime: false,
              }),
            );
            templateId = res.body.id;
            done();
          });
      });

      it('should not allow to create exercise template with the same name', (done) => {
        request(app.getHttpServer())
          .post(uri)
          .send({ name, hasRepetitions: true, hasWeight: true, hasTime: false })
          .set('Authorization', accessToken)
          .expect(HttpStatus.FORBIDDEN, done);
      });
    });

    describe('/ (PATCH)', () => {
      it('should edit template', (done) => {
        request(app.getHttpServer())
          .patch(`${uri}/${templateId}`)
          .send({ name: newName, hasRepetitions: false })
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual({
              id: templateId,
              createdById: user.id,
              name: newName,
              hasRepetitions: false,
              hasWeight: true,
              hasTime: false,
            });
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
            expect(res.body).toEqual([
              {
                id: templateId,
                createdById: user.id,
                name: newName,
                hasRepetitions: false,
                hasWeight: true,
                hasTime: false,
              },
            ]);
            done();
          });
      });
    });

    describe('/ (DELETE)', () => {
      it('should delete template', (done) => {
        request(app.getHttpServer())
          .delete(`${uri}/${templateId}`)
          .set('Authorization', accessToken)
          .expect(HttpStatus.OK, done);
      });
    });
  });
});
