import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('GET_fetchPlayerByID', () => {
  it('should return the player with the given ID', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByID: jest
            .fn()
            .mockResolvedValueOnce({
              id: 'PLR-2',
              level: 0,
              armySize: 0,
            })
            .mockResolvedValue({
              id: 'PLR-1',
              level: 0,
              armySize: 0,
            }),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-2',
        },
      },
      authenticatedPlayer: {
        id: 'PLR-2',
      },
    });

    const response = await request(application)
      .get('/players/PLR-1')
      .set('Authorization', 'Bearer TOKEN')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 'PLR-1',
      level: 1,
      armySize: 0,
    });
  });

  it('should return a 404 if the player does not exist', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByID: jest
            .fn()
            .mockResolvedValueOnce({
              id: 'PLR-2',
              level: 0,
              armySize: 0,
            })
            .mockResolvedValue(null),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        id: 'PLR-1',
      },
    });

    const response = await request(application)
      .get('/players/PLR-1')
      .set('Authorization', 'Bearer TOKEN')
      .send();

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'player_not_found',
          title: 'Player not found',
        },
      ],
    });
  });
});
