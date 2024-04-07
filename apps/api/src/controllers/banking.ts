import { Request, Response } from 'express';

export default {
  POST_deposit: async (req: Request, res: Response) => {
    const { amount } = req.body;

    if (amount <= 0) {
      res.status(400).send({
        errors: [
          {
            code: 'non_positive_deposit',
            title: 'Non positive deposit',
          },
        ],
      });
      return;
    }

    await req.ctx.authedPlayer.depositGold(amount);

    res.status(200).send('OK');
  },

  POST_withdraw: async (req: Request, res: Response) => {
    const { amount } = req.body;

    if (amount <= 0) {
      res.status(400).send({
        errors: [
          {
            code: 'non_positive_withdraw',
            title: 'Non positive withdraw',
          },
        ],
      });
      return;
    }

    await req.ctx.authedPlayer.withdrawGold(amount);

    res.status(200).send('OK');
  },
};
