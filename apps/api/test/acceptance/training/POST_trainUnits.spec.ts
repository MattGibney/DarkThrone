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
      .send({
        desiredUnits: [],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['training.train.noUnitsRequested'],
    });
  });

  it('should return 400 if zero or negative number of units requested', async () => {
    const { application } = createAppForTest({});

    // fails to train when requesting zero units to train
    let response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send({
        desiredUnits: [{ unitType: 'citizen', quantity: 0 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['training.train.nonPositiveUnitsRequested'],
    });

    // fails to train when requesting a negative number of units
    response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send({
        desiredUnits: [{ unitType: 'citizen', quantity: -1 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['training.train.nonPositiveUnitsRequested'],
    });
  });

  it('should return 400 if not enough citizens', async () => {
    const { application } = createAppForTest({});

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send({
        desiredUnits: [{ unitType: 'citizen', quantity: 1 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['training.train.notEnoughCitizens'],
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
      .send({
        desiredUnits: [{ unitType: 'worker', quantity: 1 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['training.train.notEnoughGold'],
    });
  });

  it('should train units and subtract gold', async () => {
    const playerRow = {
      id: 'PLR-1',
      user_id: 'USR-1',
      display_name: 'Player 1',
      race: 'human',
      class: 'fighter',
      avatar_url: null,
      created_at: new Date(),
      attack_turns: 10,
      gold_in_bank: 0,
      experience: 0,
      overall_rank: 1,
      structureUpgrades: { fortification: 0, housing: 0 },
    };

    const mockDAOFactory = {
      playerUnits: {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
      player: {
        fetchByID: jest.fn().mockResolvedValue({
          ...playerRow,
          gold: 10000,
        }),
        update: jest.fn().mockResolvedValue({
          ...playerRow,
          gold: 7500,
        }),
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
      playerGold: 10000,
      daoFactory: mockDAOFactory,
    });

    const response = await request(application)
      .post('/training/train')
      .set('Authorization', 'Bearer token')
      .send({
        desiredUnits: [
          { unitType: 'worker', quantity: 1 },
          { unitType: 'soldier_1', quantity: 1 },
        ],
      });

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

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.gold).toBe(7500);
    expect(response.body.units).toEqual([
      { unitType: 'citizen', quantity: 8 },
      { unitType: 'worker', quantity: 2 },
    ]);
    expect(response.body.goldPerTurn).toBe(10100);
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
