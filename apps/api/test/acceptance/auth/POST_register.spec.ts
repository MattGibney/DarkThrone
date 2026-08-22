import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_register', () => {
  it('rejects all new account registrations without accessing user data', async () => {
    const fetchByEmail = jest.fn();
    const createUser = jest.fn();
    const createSession = jest.fn();
    const { application } = makeApplication({
      daoFactory: {
        user: {
          fetchByEmail,
          create: createUser,
        },
        userSession: {
          create: createSession,
        },
      } as unknown as DaoFactory,
    });

    const res = await request(application)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1' });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ errors: ['auth.register.closed'] });
    expect(fetchByEmail).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });
});
