// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  FortificationUpgrade,
  UnitType,
  type Unit,
} from '@darkthrone/interfaces';

export const UnitTypes: { [k: string]: Unit } = {
  citizen: {
    name: 'Citizen',
    type: UnitType.SUPPORT,
    attack: 0,
    defence: 0,
    cost: 0,
    goldPerTurn: 0,
    canTrain: false,
    canUntrain: false,
  },
  worker: {
    name: 'Worker',
    type: UnitType.SUPPORT,
    attack: 0,
    defence: 0,
    cost: 1000,
    goldPerTurn: 50,
    canTrain: true,
    canUntrain: true,
  },
  soldier_1: {
    name: 'Soldier',
    type: UnitType.OFFENSE,
    attack: 3,
    defence: 0,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
  guard_1: {
    name: 'Guard',
    type: UnitType.DEFENSE,
    attack: 0,
    defence: 3,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
};

export const levelXPArray: number[] = [
  4000, 8000, 13000, 19000, 26000, 34000, 43000, 53000, 64000, 76000, 89000,
  103000, 118000, 134000, 151000, 169000, 188000, 208000, 229000, 251000,
  274000, 298000, 323000, 349000, 376000, 404000, 433000, 463000, 494000,
  526000, 559000, 593000, 628000, 664000, 701000, 739000, 778000, 818000,
  859000, 901000, 944000, 988000, 1033000, 1079000, 1126000, 1174000, 1223000,
  1273000, 1324000, 1376000, 1429000, 1483000, 1538000, 1594000, 1651000,
  1709000, 1768000, 1828000, 1889000, 1951000, 2014000, 2078000, 2143000,
  2209000, 2276000, 2344000, 2413000, 2483000, 2554000, 2626000, 2699000,
  2773000, 2848000, 2924000, 3001000, 3079000, 3158000, 3238000, 3319000,
  3401000, 3484000, 3568000, 3653000, 3739000, 3826000, 3914000, 4003000,
  4093000, 4184000, 4276000, 4369000, 4463000, 4558000, 4654000, 4751000,
  4849000, 4948000, 5048000, 5149000, 5251000,
];

export const fortificationUpgrades: FortificationUpgrade[] = [
  {
    name: 'Manor',
    levelRequirement: 1,
    cost: 0,
    defenceBonusPercentage: 5,
    goldPerTurn: 10000,
  },
  {
    name: 'Village',
    levelRequirement: 5,
    goldPerTurn: 2000,
    defenceBonusPercentage: 10,
    cost: 100000,
  },
];

export const structureUpgrades = {
  fortification: fortificationUpgrades,
};

const attackLevelRange = 7;

export const attackableLevels = (
  player1_level: number,
  player2_level: number,
): boolean => Math.abs(player1_level - player2_level) <= attackLevelRange;

export const attackableMinLevel = (playerLevel: number): number =>
  Math.max(1, playerLevel - attackLevelRange);
export const attackableMaxLevel = (playerLevel: number): number =>
  playerLevel + attackLevelRange;
