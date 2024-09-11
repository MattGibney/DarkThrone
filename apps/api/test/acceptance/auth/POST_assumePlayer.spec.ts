import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_assumePlayer', () => {
  it('should return 400 if player ID is missing', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {},
      },
      authenticatedPlayer: undefined,
    });

    const res = await request(application)
      .post('/auth/assume-player')
      .set('Authorization', 'Bearer TOKEN')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual({
      code: 'assume_player_player_id_required',
      title: 'Player ID required',
    });
  });

  it('should return 404 if player is not found', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByID: jest.fn().mockResolvedValue(undefined),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {},
      },
      authenticatedPlayer: undefined,
    });

    const res = await request(application)
      .post('/auth/assume-player')
      .set('Authorization', 'Bearer TOKEN')
      .send({ playerID: 'PLR-1' });
    expect(res.status).toBe(404);
    expect(res.body.errors).toContainEqual({
      code: 'assume_player_player_not_found',
      title: 'Player not found',
    });
  });

  it('should return 403 if player does not belong to user', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByID: jest.fn().mockResolvedValue({ userID: 'USR-1' }),
        },
        playerUnits: {
          fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: { id: 'USR-2' },
        session: {},
      },
      authenticatedPlayer: undefined,
    });

    const res = await request(application)
      .post('/auth/assume-player')
      .set('Authorization', 'Bearer TOKEN')
      .send({ playerID: 'PLR-1' });

    expect(res.status).toBe(403);

    expect(res.body.errors).toContainEqual({
      code: 'assume_player_not_your_player',
      // eslint-disable-next-line quotes
      title: "You can't assume another player's account",
    });
  });

  it('should assume the player', async () => {
    const { application, daoFactory, logger } = makeApplication({
      daoFactory: {
        player: {
          fetchByID: jest.fn().mockResolvedValue({
            id: 'PLR-1',
            user_id: 'USR-2',
            structureUpgrades: {
              fortification: 0,
              housing: 0,
            },
          }),
          fetchBankHistory: jest.fn().mockResolvedValue([]),
        },
        playerUnits: {
          fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
        },
        userSession: {
          assumePlayer: jest.fn().mockResolvedValue({}),
          fetchValidByToken: jest.fn().mockResolvedValue({
            id: 'SES-1',
          }),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: { id: 'USR-2' },
        session: {},
      },
      authenticatedPlayer: undefined,
    });

    const res = await request(application)
      .post('/auth/assume-player')
      .set('Authorization', 'Bearer TOKEN')
      .send({ playerID: 'PLR-1' });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.player).toBeDefined();

    expect(daoFactory.userSession.assumePlayer).toHaveBeenCalledWith(
      logger,
      'SES-1',
      'PLR-1',
    );
  });
});
