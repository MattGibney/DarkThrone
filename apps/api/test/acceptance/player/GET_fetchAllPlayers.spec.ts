import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('GET_fetchAllPlayers', () => {
  it('should return a list of players', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchAllPaginated: jest
            .fn()
            .mockImplementation((logger, paginator) => {
              paginator.totalItemCount = 1;
              paginator.dataRows = [{}];
            }),
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
      .get('/players')
      .set('Authorization', 'Bearer TOKEN')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      items: [
        {
          armySize: 0,
          level: 1,
        },
      ],
      meta: {
        page: 1,
        pageSize: 1,
        totalItemCount: 1,
        totalPageCount: 1,
      },
    });
  });
});
