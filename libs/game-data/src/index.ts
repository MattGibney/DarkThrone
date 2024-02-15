import type { UnitType } from '@darkthrone/interfaces';

export const UnitTypes: { [k: string]: UnitType } = {
  citizen: {
    attack: 0,
    defence: 0,
    cost: 0,
    goldPerTurn: 0,
    canTrain: false,
    canUntrain: false,
  },
  worker: {
    attack: 0,
    defence: 0,
    cost: 1000,
    goldPerTurn: 50,
    canTrain: true,
    canUntrain: true,
  },
  soldier_1: {
    attack: 3,
    defence: 0,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
  guard_1: {
    attack: 0,
    defence: 3,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
}
