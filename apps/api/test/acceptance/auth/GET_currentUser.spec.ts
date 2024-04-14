import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('GET_currentUser', () => {
  it('should return the current user', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {},
      },
      authenticatedPlayer: undefined,
    });

    const res = await request(application)
      .get('/auth/current-user')
      .set('Authorization', 'Bearer TOKEN');

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.player).toBeUndefined();
  });

  it('should return the current user and player', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchBankHistory: jest.fn().mockResolvedValue([]),
          fetchByID: jest.fn().mockResolvedValue({}),
        },
        playerUnits: {
          fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
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
      .get('/auth/current-user')
      .set('Authorization', 'Bearer TOKEN');

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.player).toBeDefined();
  });
});
