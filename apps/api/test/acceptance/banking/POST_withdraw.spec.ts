import request from 'supertest';
import makeApplication from '../helpers/makeApplication';
import DaoFactory from '../../../src/daoFactory';

describe('POST_withdraw', () => {
  it('should return a 400 if the amount is less than 0', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {},
      },
      authenticatedPlayer: {},
    });

    const response = await request(application)
      .post('/bank/withdraw')
      .set('Authorization', 'Bearer TOKEN')
      .send({
        amount: -1,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: ['banking.withdraw.negativeAmount'],
    });
  });

  it('should return a 400 if the amount exceeds the player gold in bank', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        gold_in_bank: 100,
      },
    });

    const response = await request(application)
      .post('/bank/withdraw')
      .set('Authorization', 'Bearer TOKEN')
      .send({
        amount: 101,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: ['banking.withdraw.insufficientFunds'],
    });
  });

  it('should return a 200 if the amount is valid', async () => {
    const { application, daoFactory, logger } = makeApplication({
      daoFactory: {
        player: {
          createBankHistory: jest.fn(),
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
        gold_in_bank: 100,
      },
    });

    const response = await request(application)
      .post('/bank/withdraw')
      .set('Authorization', 'Bearer TOKEN')
      .send({
        amount: 50,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ amount: 50 });

    expect(daoFactory.player.createBankHistory).toHaveBeenCalledWith(
      logger,
      'PLR-1',
      50,
      'withdraw',
    );
  });
});
