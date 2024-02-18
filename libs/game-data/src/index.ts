// eslint-disable-next-line @nx/enforce-module-boundaries
import type { UnitType } from '@darkthrone/interfaces';

export const UnitTypes: { [k: string]: UnitType } = {
  citizen: {
    name: 'Citizen',
    type: 'support',
    attack: 0,
    defence: 0,
    cost: 0,
    goldPerTurn: 0,
    canTrain: false,
    canUntrain: false,
  },
  worker: {
    name: 'Worker',
    type: 'support',
    attack: 0,
    defence: 0,
    cost: 1000,
    goldPerTurn: 50,
    canTrain: true,
    canUntrain: true,
  },
  soldier_1: {
    name: 'Soldier',
    type: 'offense',
    attack: 3,
    defence: 0,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
  guard_1: {
    name: 'Guard',
    type: 'defense',
    attack: 0,
    defence: 3,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
}
