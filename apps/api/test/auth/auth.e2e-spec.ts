import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createE2ETestApp } from '../utils/e2e.utils';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2ETestApp();
  });

  describe('Endpoints', () => {
    let accessToken: string;
    let refreshToken: string;
    const email = 'test@mail.com';
    const password = 'password';

    describe('/auth/signup (POST)', () => {
      it('should allow user to sign up', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email, password })
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            done();
          });
      });

      it('should not allow user to register with already occupied email', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email, password })
          .expect(HttpStatus.FORBIDDEN, done);
      });
    });

    describe('/auth/login (POST)', () => {
      it('should allow user to log in', (done) => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('should not allow user to log in with incorrect password', (done) => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password: 'badPassword' })
          .expect(HttpStatus.UNAUTHORIZED, done);
      });

      it('should not allow user to log in with incorrect email', (done) => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@badmail.com', password })
          .expect(HttpStatus.UNAUTHORIZED, done);
      });
    });

    describe('/auth/refresh-token (POST)', () => {
      it('should allow user to refresh access token', (done) => {
        request(app.getHttpServer())
          .post('/auth/refresh-token')
          .send({ refreshToken })
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('does not allow user to refresh access token with malformed refresh token', (done) => {
        request(app.getHttpServer())
          .post('/auth/refresh-token')
          .send({ refreshToken: 'malformed-token' })
          .expect(HttpStatus.UNAUTHORIZED, done);
      });
    });

    describe('/auth/logout (POST)', () => {
      it('should allow user to log out', (done) => {
        request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(HttpStatus.OK, done);
      });

      it('should not allow user to log out without an access token', (done) => {
        request(app.getHttpServer())
          .post('/auth/logout')
          .expect(HttpStatus.UNAUTHORIZED, done);
      });
    });
  });

  describe('Stories', () => {
    let accessToken: string;
    let refreshToken: string;
    const email = 'testStory@mail.com';
    const password = 'password';

    describe('Register story', () => {
      it('should allow user to sign up', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email, password })
          .expect(HttpStatus.CREATED)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('should allow user to log out', (done) => {
        request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(HttpStatus.OK, done);
      });

      it('should allow user to log in', (done) => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('should allow user to refresh access token', (done) => {
        request(app.getHttpServer())
          .post('/auth/refresh-token')
          .send({ refreshToken })
          .expect(HttpStatus.OK)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
              }),
            );
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('should allow user to log out', (done) => {
        request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(HttpStatus.OK, done);
      });

      it('does not allow user to refresh access token after logging out', (done) => {
        request(app.getHttpServer())
          .post('/auth/refresh-token')
          .send({ refreshToken })
          .expect(HttpStatus.UNAUTHORIZED, done);
      });
    });
  });
});
