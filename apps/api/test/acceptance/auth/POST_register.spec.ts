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
    expect(res.body.errors).toContainEqual({
      code: 'register_email_required',
      title: 'Email required',
    });
  });

  it('should return 400 if password is missing', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual({
      code: 'register_password_too_short',
      title: 'The password length must be at least 7 characters long',
    });
  });

  it('should return 400 if password is too short', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual({
      code: 'register_password_too_short',
      title: 'The password length must be at least 7 characters long',
    });
  });

  it('should return 400 if password lacks a lower case character', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'PASSWORD' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual({
      code: 'register_password_requires_lower_case',
      title: 'The password lacks a lower case character',
    });
  });

  it('should return 400 if password lacks an upper case character', async () => {
    const { application } = makeApplication({});

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual({
      code: 'register_password_requires_upper_case',
      title: 'The password lacks an upper case character',
    });
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
    expect(res.body.errors).toContainEqual({
      code: 'register_email_taken',
      title: 'Email taken',
    });
  });

  it('should return 400 if user creation fails', async () => {
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
    expect(res.body.errors).toContainEqual({
      code: 'register_failed',
      title: 'Registration failed',
    });
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
    expect(res.body.errors).toContainEqual({
      code: 'register_failed',
      title: 'Registration failed',
    });
  });

  it('should return 200 if registration is successful', async () => {
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({ id: 1 }),
        },
        userSession: {
          create: jest.fn().mockResolvedValue({ id: 1, token: 'token' }),
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(200);
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
