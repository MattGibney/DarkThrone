import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_logout', () => {
  it('should return 200 if the session is found', async () => {
    const { application } = makeApplication({
      daoFactory: {
        userSession: {
          fetchValidByToken: jest.fn().mockResolvedValue({}),
          invalidate: jest.fn().mockResolvedValue(undefined),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {},
      },
    });

    const res = await request(application)
      .post('/auth/logout')
      .set('Authorization', 'Bearer TOKEN');

    expect(res.status).toBe(204);
  });
});
