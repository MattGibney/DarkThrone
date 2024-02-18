import { UnitTypes } from '@darkthrone/game-data';
import { PlayerUnits } from '@darkthrone/interfaces';
import { Request, Response } from 'express';
import PlayerUnitsModel from '../models/playerUnits';

export default {
  POST_trainUnits: async (req: Request, res: Response) => {
    const desiredUnits = req.body as PlayerUnits[];

    if (desiredUnits.length === 0) {
      res.status(400).send({
        errors: [{
          code: 'no_units_requested',
          title: 'No units requested',
        }],
      });
      return;
    }

    const availableCitizens = req.ctx.authedPlayer.units.find((unit) => unit.unitType === 'citizen')?.quantity || 0;
    const totalUnitsRequested = desiredUnits.reduce((acc, unit) => acc + unit.quantity, 0);
    if (totalUnitsRequested > availableCitizens) {
      res.status(400).send({
        errors: [{
          code: 'not_enough_citizens',
          title: 'Not enough citizens',
        }],
      });
      return;
    }

    const totalCost = desiredUnits.reduce((acc, unit) => acc + unit.quantity * UnitTypes[unit.unitType].cost, 0);
    if (totalCost > req.ctx.authedPlayer.gold) {
      res.status(400).send({
        errors: [{
          code: 'not_enough_gold',
          title: 'Not enough gold',
        }],
      });
      return;
    }

    // Train Units
    const { toCreate, toUpdate } = splitUnitsToCreateAndUpdate(desiredUnits, req.ctx.authedPlayer.units);
    await Promise.all(toCreate.map((unit) => PlayerUnitsModel.create(req.ctx, req.ctx.authedPlayer.id, unit.unitType, unit.quantity)));
    await Promise.all(toUpdate.map((unit) => {
      unit.quantity += desiredUnits.find((u) => u.unitType === unit.unitType)?.quantity || 0;
      return unit.save();
    }));

    // Subtract Citizens
    const citizenUnits = req.ctx.authedPlayer.units.find((unit) => unit.unitType === 'citizen');
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
    res.status(200).send({ message: 'Not implemented' });
  }
}

export function splitUnitsToCreateAndUpdate(desiredUnits: PlayerUnits[], existingUnits: PlayerUnitsModel[]): { toCreate: PlayerUnits[], toUpdate: PlayerUnitsModel[] } {
  const toCreate: PlayerUnits[] = [];
  const toUpdate: PlayerUnitsModel[] = [];

  desiredUnits.forEach((desiredUnit) => {
    const existingUnit = existingUnits.find((unit) => unit.unitType === desiredUnit.unitType);
    if (existingUnit) {
      toUpdate.push(existingUnit);
    } else {
      toCreate.push(desiredUnit);
    }
  });

  return { toCreate, toUpdate };
}
