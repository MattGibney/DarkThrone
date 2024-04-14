import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('GET_fetchPlayersForUser', () => {
  it('should return a list of players for the authenticated user', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchAllForUser: jest.fn().mockImplementation(() => {
            return [{}, {}];
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
      .get('/auth/current-user/players')
      .set('Authorization', 'Bearer TOKEN')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        armySize: 0,
        level: 0,
      },
      {
        armySize: 0,
        level: 0,
      },
    ]);
  });
});
