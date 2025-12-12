import { UnitTypes } from '@darkthrone/game-data';
import {
  ExtractErrorCodesForStatuses,
  PlayerUnits,
  POST_trainUnits,
  POST_unTrainUnits,
  TypedRequest,
  TypedResponse,
} from '@darkthrone/interfaces';
import PlayerUnitsModel from '../models/playerUnits';
import { protectPrivateAPI } from '../middleware/protectAuthenticatedRoutes';

export default {
  POST_trainUnits: protectPrivateAPI(
    async (
      req: TypedRequest<POST_trainUnits>,
      res: TypedResponse<POST_trainUnits>,
    ) => {
      const { desiredUnits } = req.body;

      if (desiredUnits.length === 0) {
        res.status(400).send({
          errors: ['training.train.noUnitsRequested'],
        });
        return;
      }

      if (desiredUnits.find(({ quantity }) => quantity <= 0)) {
        res.status(400).send({
          errors: ['training.train.nonPositiveUnitsRequested'],
        });
        return;
      }

      const availableCitizens =
        req.ctx.authedPlayer.units.find((unit) => unit.unitType === 'citizen')
          ?.quantity || 0;
      const totalUnitsRequested = desiredUnits.reduce(
        (acc, unit) => acc + unit.quantity,
        0,
      );
      if (totalUnitsRequested > availableCitizens) {
        res.status(400).send({
          errors: ['training.train.notEnoughCitizens'],
        });
        return;
      }

      const totalCost = desiredUnits.reduce(
        (acc, unit) => acc + unit.quantity * UnitTypes[unit.unitType].cost,
        0,
      );
      if (totalCost > req.ctx.authedPlayer.gold) {
        res.status(400).send({
          errors: ['training.train.notEnoughGold'],
        });
        return;
      }

      // Train Units
      const { toCreate, toUpdate } = splitUnitsToCreateAndUpdate(
        desiredUnits,
        req.ctx.authedPlayer.units,
      );
      await Promise.all(
        toCreate.map((unit) =>
          PlayerUnitsModel.create(
            req.ctx,
            req.ctx.authedPlayer.id,
            unit.unitType,
            unit.quantity,
          ),
        ),
      );
      await Promise.all(
        toUpdate.map((unit) => {
          unit.quantity +=
            desiredUnits.find((u) => u.unitType === unit.unitType)?.quantity ||
            0;
          return unit.save();
        }),
      );

      // Subtract Citizens
      const citizenUnits = req.ctx.authedPlayer.units.find(
        (unit) => unit.unitType === 'citizen',
      );
      if (citizenUnits) {
        citizenUnits.quantity -= totalUnitsRequested;
        await citizenUnits.save();
      }

      // Subtract Gold
      req.ctx.authedPlayer.gold -= totalCost;
      await req.ctx.authedPlayer.save();

      res.status(200).json(await req.ctx.authedPlayer.serialiseAuthedPlayer());
    },
  ),

  POST_unTrainUnits: protectPrivateAPI(
    async (
      req: TypedRequest<POST_unTrainUnits>,
      res: TypedResponse<POST_unTrainUnits>,
    ) => {
      const { unitsToUnTrain } = req.body;

      if (unitsToUnTrain.length === 0) {
        res.status(400).send({
          errors: ['training.untrain.noUnitsRequested'],
        });
        return;
      }

      if (unitsToUnTrain.find(({ quantity }) => quantity <= 0)) {
        res.status(400).send({
          errors: ['training.untrain.nonPositiveUnitsRequested'],
        });
        return;
      }

      type PossibleValidationErrors = ExtractErrorCodesForStatuses<
        POST_unTrainUnits,
        400
      >;
      const unitValiateErrors: PossibleValidationErrors[] = [];
      unitsToUnTrain.forEach((unit) => {
        const existingUnit = req.ctx.authedPlayer.units.find(
          (u) => u.unitType === unit.unitType,
        );
        if (!existingUnit || existingUnit?.quantity < unit.quantity) {
          unitValiateErrors.push('training.untrain.notEnoughUnitsTrained');
        }
      });

      if (unitValiateErrors.length > 0) {
        res.status(400).send({ errors: unitValiateErrors });
        return;
      }

      const totalCost = unitsToUnTrain.reduce(
        (acc, unit) => acc + unit.quantity * UnitTypes[unit.unitType].cost,
        0,
      );
      if (totalCost > req.ctx.authedPlayer.gold) {
        res.status(400).send({
          errors: ['training.untrain.insufficientGold'],
        });
        return;
      }

      // Untrain Units
      const { toUpdate } = splitUnitsToCreateAndUpdate(
        unitsToUnTrain,
        req.ctx.authedPlayer.units,
      );
      await Promise.all(
        toUpdate.map((unit) => {
          unit.quantity -=
            unitsToUnTrain.find((u) => u.unitType === unit.unitType)
              ?.quantity || 0;
          return unit.save();
        }),
      );

      // Add Citizens
      const totalUnitsRequested = unitsToUnTrain.reduce(
        (acc, unit) => acc + unit.quantity,
        0,
      );
      const citizenUnits = req.ctx.authedPlayer.units.find(
        (unit) => unit.unitType === 'citizen',
      );
      if (citizenUnits) {
        citizenUnits.quantity += totalUnitsRequested;
        await citizenUnits.save();
      }

      req.ctx.authedPlayer.gold -= totalCost;
      await req.ctx.authedPlayer.save();

      res.status(200).json(await req.ctx.authedPlayer.serialiseAuthedPlayer());
    },
  ),
};

export function splitUnitsToCreateAndUpdate(
  desiredUnits: PlayerUnits[],
  existingUnits: PlayerUnitsModel[],
): { toCreate: PlayerUnits[]; toUpdate: PlayerUnitsModel[] } {
  const toCreate: PlayerUnits[] = [];
  const toUpdate: PlayerUnitsModel[] = [];

  desiredUnits.forEach((desiredUnit) => {
    const existingUnit = existingUnits.find(
      (unit) => unit.unitType === desiredUnit.unitType,
    );
    if (existingUnit) {
      toUpdate.push(existingUnit);
    } else {
      toCreate.push(desiredUnit);
    }
  });

  return { toCreate, toUpdate };
}
