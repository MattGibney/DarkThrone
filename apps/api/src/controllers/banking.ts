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

    const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const depositHistory =
      await req.ctx.authedPlayer.fetchBankHistory(date24HoursAgo);
    const depositsMade = depositHistory.filter(
      (history) => history.transaction_type === 'deposit',
    ).length;

    // TODO: Make Dynamic based on structure upgrades
    if (depositsMade >= 3) {
      res.status(400).send({
        errors: [
          {
            code: 'max_deposits_reached',
            title: 'Max deposits reached',
          },
        ],
      });
      return;
    }

    const maxDeposit = Math.floor(req.ctx.authedPlayer.gold * 0.8);
    if (amount > maxDeposit) {
      res.status(400).send({
        errors: [
          {
            code: 'exceeds_max_deposit',
            title: 'Exceeds max deposit',
            detail: `The maximum deposit amount is ${maxDeposit} gold.`,
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

    const playerGoldInBank = req.ctx.authedPlayer.goldInBank;
    if (amount > playerGoldInBank) {
      res.status(400).send({
        errors: [
          {
            code: 'insufficient_funds',
            title: 'Insufficient funds',
          },
        ],
      });
      return;
    }

    await req.ctx.authedPlayer.withdrawGold(amount);

    res.status(200).send('OK');
  },
};
