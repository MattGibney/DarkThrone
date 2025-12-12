import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import { structureUpgrades } from '@darkthrone/game-data';
import {
  POST_upgradeStructure,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';

export default {
  POST_upgradeStructure: protectPrivateAPI(
    async (
      req: TypedRequest<POST_upgradeStructure>,
      res: TypedResponse<POST_upgradeStructure>,
    ) => {
      const { structureType } = req.body;

      const nextStructureUpgrade = structureUpgrades[structureType]
        ? structureUpgrades[structureType][
            req.ctx.authedPlayer.structureUpgrades[structureType] + 1
          ]
        : null;
      if (!nextStructureUpgrade) {
        res.status(400).send({ errors: ['structure.upgrade.notFound'] });
        return;
      }

      if (nextStructureUpgrade.type === 'fortification') {
        if (
          nextStructureUpgrade.levelRequirement > req.ctx.authedPlayer.level
        ) {
          res
            .status(400)
            .send({ errors: ['structure.upgrade.levelRequirementNotMet'] });
          return;
        }
      } else {
        if (
          nextStructureUpgrade.requiredFortificationLevel >
          req.ctx.authedPlayer.structureUpgrades.fortification
        ) {
          res.status(400).send({
            errors: ['structure.upgrade.fortificationRequirementNotMet'],
          });
          return;
        }
      }

      if (req.ctx.authedPlayer.gold < nextStructureUpgrade.cost) {
        res.status(400).send({
          errors: ['structure.upgrade.notEnoughGold'],
        });
        return;
      }

      await req.ctx.authedPlayer.upgradeStructure(
        structureType,
        nextStructureUpgrade,
      );

      res.status(200).send({ status: 'success' });
    },
  ),
};
