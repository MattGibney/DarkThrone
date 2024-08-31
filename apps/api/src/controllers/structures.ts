import { Request, Response } from 'express';
import { APIError } from '@darkthrone/client-library';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';
import { structureUpgrades } from '@darkthrone/game-data';

export default {
  POST_upgradeStructure: protectPrivateAPI(
    async (req: Request, res: Response) => {
      const structureType = req.body
        .structureType as keyof typeof structureUpgrades;

      const apiErrors: APIError[] = [];

      const nextStructureUpgrade = structureUpgrades[structureType]
        ? structureUpgrades[structureType][
            req.ctx.authedPlayer.structureUpgrades[structureType] + 1
          ]
        : null;
      if (!nextStructureUpgrade) {
        apiErrors.push({
          code: 'upgrade_structure_not_found',
          title: 'Structure upgrade not found',
        });
      }

      if (apiErrors.length > 0) {
        res.status(400).send({ errors: apiErrors });
        return;
      }

      if (nextStructureUpgrade.type === 'fortification') {
        if (
          nextStructureUpgrade.levelRequirement > req.ctx.authedPlayer.level
        ) {
          apiErrors.push({
            code: 'upgrade_structure_level_requirement_not_met',
            title: 'Level requirement not met',
          });
        }
      } else {
        if (
          nextStructureUpgrade.requiredFortificationLevel >
          req.ctx.authedPlayer.structureUpgrades.fortification
        ) {
          apiErrors.push({
            code: 'upgrade_structure_fortification_requirement_not_met',
            title: 'Fortification requirement not met',
          });
        }
      }

      if (req.ctx.authedPlayer.gold < nextStructureUpgrade.cost) {
        res.status(400).send({
          errors: [
            {
              code: 'upgrade_structure_not_enough_gold',
              title: 'Not enough gold',
            },
          ],
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
