import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_register', () => {
  it('should return 400 if email is missing', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.missingParams');
  });

  it('should return 400 if password is missing', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.invalidPassword');
  });

  it('should return 400 if password is too short', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.invalidPassword');
  });

  it('should return 400 if password lacks a lower case character', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'PASSWORD' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.invalidPassword');
  });

  it('should return 400 if password lacks an upper case character', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.invalidPassword');
  });

  it('should return 400 if email is taken', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: jest.fn().mockResolvedValue({ id: 1 }),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('auth.emailInUse');
  });

  it('should return 500 if user creation fails', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(null),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(500);
    expect(res.body.errors).toContain('server.error');
  });

  it('should return 500 if session creation fails', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 1 }),
        },
        userSession: {
          create: jest.fn().mockResolvedValue(null),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(500);
    expect(res.body.errors).toContain('server.error');
  });

  it('should return 201 if registration is successful', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 1 }),
        },
        userSession: {
          create: jest.fn().mockResolvedValue({
            id: 1,
            token: 'token',
            serialise: async () => ({
              id: 1,
              hasConfirmedEmail: false,
              serverTime: 'SOME_TIME',
            }),
          }),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      session: {
        id: 1,
        hasConfirmedEmail: false,
        serverTime: expect.any(String),
      },
      token: 'token',
    });
  });
});
