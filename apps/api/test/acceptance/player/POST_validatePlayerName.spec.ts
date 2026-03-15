import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_validatePlayerName', () => {
  it('should return 400 if the display name is empty', async () => {
    const fetchByDisplayName = jest.fn();
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByDisplayName,
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {},
      },
    });

    const response = await request(application)
      .post('/players/validate-name')
      .set('Authorization', 'Bearer TOKEN')
      .send({ displayName: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['player.name.validation.empty'],
    });
    expect(fetchByDisplayName).not.toHaveBeenCalled();
  });

  it('should return 200 when the display name passes validation', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchByDisplayName: jest.fn().mockResolvedValue(null),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {},
      },
    });

    const response = await request(application)
      .post('/players/validate-name')
      .set('Authorization', 'Bearer TOKEN')
      .send({ displayName: 'Valid_Name_7' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isValid: true,
      issues: [],
    });
  });
});
