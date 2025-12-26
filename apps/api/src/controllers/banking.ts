import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import {
  POST_deposit,
  POST_withdraw,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';

export default {
  POST_deposit: protectPrivateAPI(
    async (
      req: TypedRequest<POST_deposit>,
      res: TypedResponse<POST_deposit>,
    ) => {
      const { amount } = req.body;

      // Ensure amount is an integer
      const amountInt = parseInt(amount.toString(), 10);

      if (isNaN(amountInt)) {
        res.status(400).json({
          errors: ['banking.deposit.invalidAmount'],
        });
        return;
      }

      // Use amountInt instead of amount below

      if (amountInt <= 0) {
        res.status(400).json({
          errors: ['banking.deposit.negativeAmount'],
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
        res.status(400).json({
          errors: ['banking.deposit.maxDepositsReached'],
        });
        return;
      }

      const maxDeposit = Math.floor(req.ctx.authedPlayer.gold * 0.8);
      if (amountInt > maxDeposit) {
        res.status(400).json({
          errors: ['banking.deposit.exceedsMaxDeposit'],
        });
        return;
      }

      await req.ctx.authedPlayer.depositGold(amountInt);

      res.status(200).json({ amount: amountInt });
    },
  ),

  POST_withdraw: protectPrivateAPI(
    async (
      req: TypedRequest<POST_withdraw>,
      res: TypedResponse<POST_withdraw>,
    ) => {
      const { amount } = req.body;

      // Ensure amount is an integer
      const amountInt = parseInt(amount.toString(), 10);

      if (isNaN(amountInt)) {
        res.status(400).json({
          errors: ['banking.withdraw.invalidAmount'],
        });
        return;
      }

      // Use amountInt instead of amount below

      if (amountInt <= 0) {
        res.status(400).json({
          errors: ['banking.withdraw.negativeAmount'],
        });
        return;
      }

      const playerGoldInBank = req.ctx.authedPlayer.goldInBank;
      if (amountInt > playerGoldInBank) {
        res.status(400).json({
          errors: ['banking.withdraw.insufficientFunds'],
        });
        return;
      }

      await req.ctx.authedPlayer.withdrawGold(amountInt);

      res.status(200).json({ amount: amountInt });
    },
  ),
};
