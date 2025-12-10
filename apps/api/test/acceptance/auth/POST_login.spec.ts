import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_login', () => {
  it('should return 400 if email is missing', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/login')
      .send({ password: 'password' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.login.missingParams');
  });

  it('should return 400 if password is missing', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.login.missingParams');
  });

  it('should return 401 if user does not exist', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: async () => null,
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.login.invalidParams');
    expect(res.header['set-cookie']).toBeUndefined();
  });

  it('should return 401 if password is incorrect', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: async () => ({
            password_hash: '',
          }),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.login.invalidParams');
  });

  it('should return 500 if session cannot be created', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: async () => ({
            password_hash:
              '$2b$10$XSjPCVMnLw9GOWsm1w6.Bub7UXW82y28jamL9Zrl2gAbPghat3LvK',
          }),
        },
        userSession: {
          create: async () => null,
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(500);
    expect(res.body.errors).toContain('server.error');
  });

  it('should return 200 if login is successful', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: async () => ({
            password_hash:
              '$2b$10$XSjPCVMnLw9GOWsm1w6.Bub7UXW82y28jamL9Zrl2gAbPghat3LvK',
          }),
        },
        userSession: {
          create: async () => ({
            token: 'SESSION_TOKEN',
            serialise: async () => ({
              hasConfirmedEmail: false,
              serverTime: 'SOME_TIME',
            }),
          }),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      session: {
        hasConfirmedEmail: false,
        serverTime: expect.any(String),
      },
      token: 'SESSION_TOKEN',
    });
  });
});
