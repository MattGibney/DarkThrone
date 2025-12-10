import { attackableLevels } from '@darkthrone/game-data';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import {
  ExtractErrorCodesForStatuses,
  POST_attackPlayer,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';

export default {
  POST_attackPlayer: protectPrivateAPI(
    async (
      req: TypedRequest<POST_attackPlayer>,
      res: TypedResponse<POST_attackPlayer>,
    ) => {
      const { targetID, attackTurns } = req.body;

      const apiErrors: ExtractErrorCodesForStatuses<POST_attackPlayer, 400>[] =
        [];
      if (!targetID || !attackTurns) {
        apiErrors.push('attack.missingProps');
      }

      if (attackTurns < 1 || attackTurns > 10) {
        apiErrors.push('attack.invalidAttackTurns');
      }

      if (req.ctx.authedPlayer.attackTurns < attackTurns) {
        apiErrors.push('attack.notEnoughAttackTurns');
      }

      const attackStrength =
        await req.ctx.authedPlayer.calculateAttackStrength();
      if (attackStrength === 0) {
        apiErrors.push('attack.noAttackStrength');
      }

      if (apiErrors.length > 0) {
        res.status(400).send({ errors: apiErrors });
        return;
      }

      const targetPlayer = await req.ctx.modelFactory.player.fetchByID(
        req.ctx,
        targetID,
      );
      if (!targetPlayer) {
        res.status(404).send({
          errors: ['attack.targetNotFound'],
        });
        return;
      }

      if (!attackableLevels(req.ctx.authedPlayer.level, targetPlayer.level)) {
        res.status(400).send({
          errors: ['attack.outsideRange'],
        });
        return;
      }

      const warHistory = await req.ctx.authedPlayer.attackPlayer(
        targetPlayer,
        attackTurns,
      );

      res.status(200).send(warHistory.serialise());
    },
  ),
};
