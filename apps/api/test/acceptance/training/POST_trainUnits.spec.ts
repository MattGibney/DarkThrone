import request from 'supertest';
import deepmerge from 'deepmerge';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';
import { PlayerUnitsRow } from '../../../src/daos/playerUnits';

describe('POST /training/units', () => {
  it('should return 400 if no units requested', async () => {
    const { application } = createAppForTest({});

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'no_units_requested',
          title: 'No units requested',
        },
      ],
    });
  });

  it('should return 400 if zero or negative number of units requested', async () => {
    const { application } = createAppForTest({});

    // fails to train when requesting zero units to train
    let response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([{ unitType: 'citizen', quantity: 0 }]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'non_positive_units_requests',
          title: 'Non positive units requests',
        },
      ],
    });

    // fails to train when requesting a negative number of units
    response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([{ unitType: 'citizen', quantity: -1 }]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'non_positive_units_requests',
          title: 'Non positive units requests',
        },
      ],
    });
  });

  it('should return 400 if not enough citizens', async () => {
    const { application } = createAppForTest({});

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([{ unitType: 'citizen', quantity: 1 }]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'not_enough_citizens',
          title: 'Not enough citizens',
        },
      ],
    });
  });

  it('should return 400 if not enough gold', async () => {
    const { application } = createAppForTest({
      playerUnits: [
        {
          unit_type: 'citizen',
          quantity: 1,
        },
      ],
    });

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([{ unitType: 'worker', quantity: 1 }]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'not_enough_gold',
          title: 'Not enough gold',
        },
      ],
    });
  });

  it('should train units and subtract gold', async () => {
    const mockDAOFactory = {
      playerUnits: {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
      player: {
        fetchByID: jest.fn().mockResolvedValue({
          id: 'PLR-1',
          gold: 10000,
        }),
        update: jest.fn().mockResolvedValue({}),
      },
    } as unknown as DaoFactory;
    const { application, logger } = createAppForTest({
      playerUnits: [
        {
          id: 'UNT-1',
          player_id: 'PLR-1',
          unit_type: 'citizen',
          quantity: 10,
        },
        {
          id: 'UNT-2',
          player_id: 'PLR-1',
          unit_type: 'worker',
          quantity: 1,
        },
      ],
      daoFactory: mockDAOFactory,
    });

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send([
        { unitType: 'worker', quantity: 1 },
        { unitType: 'soldier_1', quantity: 1 },
      ]);

    expect(mockDAOFactory.playerUnits.create).toHaveBeenCalledWith(
      logger,
      'PLR-1',
      'soldier_1',
      1,
    );
    expect(mockDAOFactory.playerUnits.update).toHaveBeenCalledWith({
      id: 'UNT-2',
      player_id: 'PLR-1',
      unit_type: 'worker',
      quantity: 2,
    });
    expect(mockDAOFactory.playerUnits.update).toHaveBeenCalledWith({
      id: 'UNT-1',
      player_id: 'PLR-1',
      unit_type: 'citizen',
      quantity: 8,
    });

    expect(mockDAOFactory.player.update).toHaveBeenCalledWith(
      logger,
      'PLR-1',
      expect.objectContaining({
        gold: 7500,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Training Complete' });
  });
});

interface TestAppOptions {
  playerGold?: number;
  playerUnits?: Partial<PlayerUnitsRow>[];
  daoFactory?: Partial<DaoFactory>;
}
function createAppForTest(options: TestAppOptions) {
  return makeApplication({
    daoFactory: deepmerge(
      {
        playerUnits: {
          fetchUnitsForPlayer: jest
            .fn()
            .mockResolvedValue(options.playerUnits || []),
        },
      } as unknown as DaoFactory,
      options.daoFactory || {},
    ),
    authenticatedUser: {
      user: {},
      session: {
        player_id: 'PLR-1',
      },
    },
    authenticatedPlayer: {
      id: 'PLR-1',
      gold: options.playerGold || 0,
    },
  });
}
