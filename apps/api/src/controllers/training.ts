import { UnitTypes } from '@darkthrone/game-data';
import { PlayerUnits } from '@darkthrone/interfaces';
import { Request, Response } from 'express';
import PlayerUnitsModel from '../models/playerUnits';
import { APIError } from '@darkthrone/client-library';

const validateTrainingInputs = (desiredUnits: PlayerUnits[]): APIError[] => {
  // Used for both training and untraining units.
  // we expect only positive numbers to be used.
  if (desiredUnits.length === 0) {
    return [
      {
        code: 'no_units_requested',
        title: 'No units requested',
      },
    ];
  }

  if (desiredUnits.find(({ quantity }) => quantity <= 0)) {
    return [
      {
        code: 'non_positive_units_requests',
        title: 'Non positive units requests',
      },
    ];
  }

  return [];
};

export default {
  POST_trainUnits: async (req: Request, res: Response) => {
    const desiredUnits = req.body as PlayerUnits[];

    const errors = validateTrainingInputs(desiredUnits);
    if (errors.length > 0) {
      res.status(400).send({ errors });
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
        errors: [
          {
            code: 'not_enough_citizens',
            title: 'Not enough citizens',
          },
        ],
      });
      return;
    }

    const totalCost = desiredUnits.reduce(
      (acc, unit) => acc + unit.quantity * UnitTypes[unit.unitType].cost,
      0,
    );
    if (totalCost > req.ctx.authedPlayer.gold) {
      res.status(400).send({
        errors: [
          {
            code: 'not_enough_gold',
            title: 'Not enough gold',
          },
        ],
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
          desiredUnits.find((u) => u.unitType === unit.unitType)?.quantity || 0;
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

    res.status(200).send({ message: 'Training Complete' });
  },

  POST_unTrainUnits: async (req: Request, res: Response) => {
    const desiredUnits = req.body as PlayerUnits[];

    const errors = validateTrainingInputs(desiredUnits);
    if (errors.length > 0) {
      res.status(400).send({ errors });
      return;
    }

    const unitValiateErrors = [];
    desiredUnits.forEach((unit) => {
      const existingUnit = req.ctx.authedPlayer.units.find(
        (u) => u.unitType === unit.unitType,
      );
      if (!existingUnit) {
        unitValiateErrors.push({
          code: 'unit_not_found',
          title: `Player does not have any units of type ${unit.unitType}`,
        });
      }
      if (existingUnit?.quantity < unit.quantity) {
        unitValiateErrors.push({
          code: 'not_enough_units',
          title: `Player does not have enough units of type ${unit.unitType}`,
        });
      }
    });

    if (unitValiateErrors.length > 0) {
      res.status(400).send({ errors: unitValiateErrors });
      return;
    }

    const totalCost = desiredUnits.reduce(
      (acc, unit) => acc + unit.quantity * UnitTypes[unit.unitType].cost,
      0,
    );
    if (totalCost > req.ctx.authedPlayer.gold) {
      res.status(400).send({
        errors: [
          {
            code: 'not_enough_gold',
            title: 'Not enough gold',
          },
        ],
      });
      return;
    }

    // Untrain Units
    const { toUpdate } = splitUnitsToCreateAndUpdate(
      desiredUnits,
      req.ctx.authedPlayer.units,
    );
    await Promise.all(
      toUpdate.map((unit) => {
        unit.quantity -=
          desiredUnits.find((u) => u.unitType === unit.unitType)?.quantity || 0;
        return unit.save();
      }),
    );

    // Add Citizens
    const totalUnitsRequested = desiredUnits.reduce(
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

    res.status(200).send({ message: 'UnTraining Complete' });
  },
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
