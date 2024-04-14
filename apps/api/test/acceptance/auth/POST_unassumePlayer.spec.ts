import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_unassumePlayer', () => {
  it('should return 200 when player is unassumed', async () => {
    const { application, daoFactory, logger } = makeApplication({
      daoFactory: {
        playerUnits: {
          fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
        },
        userSession: {
          unassumePlayer: jest.fn().mockResolvedValue({}),
          fetchValidByToken: jest.fn().mockResolvedValue({
            id: 'SES-1',
          }),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {},
    });

    const res = await request(application)
      .post('/auth/unassume-player')
      .set('Authorization', 'Bearer TOKEN')
      .send({});

    expect(res.status).toBe(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.player).toBeUndefined();

    expect(daoFactory.userSession.unassumePlayer).toHaveBeenCalledWith(
      logger,
      'SES-1',
    );
  });
});
