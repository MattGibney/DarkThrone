import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_deposit', () => {
  it('should return a 400 if the amount is less than 0', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {},
      },
      authenticatedPlayer: {},
    });

    const response = await request(application)
      .post('/bank/deposit')
      .set('Authorization', 'Bearer TOKEN')
      .send({
        amount: -1,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'non_positive_deposit',
          title: 'Non positive deposit',
        },
      ],
    });
  });

  it('should return a 400 if there are are no available slots', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {
          fetchBankHistory: jest
            .fn()
            .mockResolvedValue([
              { transaction_type: 'deposit' },
              { transaction_type: 'deposit' },
              { transaction_type: 'deposit' },
            ]),
        },
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        gold: 100,
      },
    });

    const response = await request(application)
      .post('/bank/deposit')
      .set('Authorization', 'Bearer TOKEN')
      .send({ amount: 101 });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'max_deposits_reached',
          title: 'Max deposits reached',
        },
      ],
    });
  });

  it('should return a 400 if the amount exceeds the maximum deposit', async () => {
    const { application } = makeApplication({
      daoFactory: {
        player: {},
      } as unknown as DaoFactory,
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        gold: 100,
      },
    });

    const response = await request(application)
      .post('/bank/deposit')
      .set('Authorization', 'Bearer TOKEN')
      .send({ amount: 101 });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'exceeds_max_deposit',
          title: 'Exceeds max deposit',
          detail: 'The maximum deposit amount is 80 gold.',
        },
      ],
    });
  });

  it('should return a 200 if the deposit is successful', async () => {
    const { application, daoFactory, logger } = makeApplication({
      daoFactory: {
        player: {
          createBankHistory: jest.fn().mockResolvedValue({}),
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
        gold: 100,
      },
    });

    const response = await request(application)
      .post('/bank/deposit')
      .set('Authorization', 'Bearer TOKEN')
      .send({ amount: 50 });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: 'OK' });

    expect(daoFactory.player.createBankHistory).toHaveBeenCalledWith(
      logger,
      'PLR-1',
      50,
      'deposit',
    );
  });
});
