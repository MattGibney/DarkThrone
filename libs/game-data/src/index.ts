// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  FortificationUpgrade,
  HousingUpgrade,
  PlayerClass,
  PlayerRace,
  UnitType,
  type Unit,
} from '@darkthrone/interfaces';

export const UnitTypes: { [k: string]: Unit } = {
  citizen: {
    name: 'Citizen',
    type: UnitType.SUPPORT,
    attack: 0,
    defense: 0,
    cost: 0,
    goldPerTurn: 0,
    canTrain: false,
    canUntrain: false,
  },
  worker: {
    name: 'Worker',
    type: UnitType.SUPPORT,
    attack: 0,
    defense: 0,
    cost: 1000,
    goldPerTurn: 50,
    canTrain: true,
    canUntrain: true,
  },
  soldier_1: {
    name: 'Soldier',
    type: UnitType.OFFENSE,
    attack: 3,
    defense: 0,
    cost: 1500,
    goldPerTurn: 0,
    canTrain: true,
    canUntrain: true,
  },
  guard_1: {
    name: 'Guard',
    type: UnitType.DEFENSE,
    attack: 0,
    defense: 3,
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

/**
 * These all have a type param as the housing upgrades are polymorphic and
 * having this additional prop makes it far easier to ensure type safety. There
 * may be a nicer way to do this. If you know of one, PLEASE PLEASE raise a PR.
 * I'd love to know a better way to handle this.
 */
export const fortificationUpgrades: FortificationUpgrade[] = [
  {
    name: 'Manor',
    levelRequirement: 1,
    cost: 0,
    defenseBonusPercentage: 5,
    goldPerTurn: 10000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Village',
    levelRequirement: 5,
    goldPerTurn: 2000,
    defenseBonusPercentage: 10,
    cost: 100000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Town',
    levelRequirement: 10,
    goldPerTurn: 3000,
    defenseBonusPercentage: 15,
    cost: 250000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost',
    levelRequirement: 15,
    goldPerTurn: 4000,
    defenseBonusPercentage: 20,
    cost: 500000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost Level 2',
    levelRequirement: 20,
    goldPerTurn: 5000,
    defenseBonusPercentage: 25,
    cost: 1000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost Level 3',
    levelRequirement: 25,
    goldPerTurn: 6000,
    defenseBonusPercentage: 30,
    cost: 2000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold',
    levelRequirement: 30,
    goldPerTurn: 7000,
    defenseBonusPercentage: 35,
    cost: 3000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold Level 2',
    levelRequirement: 35,
    goldPerTurn: 8000,
    defenseBonusPercentage: 40,
    cost: 4000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold Level 3',
    levelRequirement: 40,
    goldPerTurn: 9000,
    defenseBonusPercentage: 45,
    cost: 5000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress',
    levelRequirement: 45,
    goldPerTurn: 10000,
    defenseBonusPercentage: 50,
    cost: 7500000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress Level 2',
    levelRequirement: 50,
    goldPerTurn: 11000,
    defenseBonusPercentage: 55,
    cost: 10000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress Level 3',
    levelRequirement: 55,
    goldPerTurn: 12000,
    defenseBonusPercentage: 60,
    cost: 15000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel',
    levelRequirement: 60,
    goldPerTurn: 13000,
    defenseBonusPercentage: 65,
    cost: 20000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel Level 2',
    levelRequirement: 65,
    goldPerTurn: 14000,
    defenseBonusPercentage: 70,
    cost: 30000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel Level 3',
    levelRequirement: 70,
    goldPerTurn: 15000,
    defenseBonusPercentage: 75,
    cost: 40000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle',
    levelRequirement: 75,
    goldPerTurn: 16000,
    defenseBonusPercentage: 80,
    cost: 50000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle Level 2',
    levelRequirement: 80,
    goldPerTurn: 17000,
    defenseBonusPercentage: 85,
    cost: 75000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle Level 3',
    levelRequirement: 85,
    goldPerTurn: 18000,
    defenseBonusPercentage: 90,
    cost: 100000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom',
    levelRequirement: 90,
    goldPerTurn: 19000,
    defenseBonusPercentage: 95,
    cost: 150000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom Level 2',
    levelRequirement: 95,
    goldPerTurn: 20000,
    defenseBonusPercentage: 100,
    cost: 200000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom Level 3',
    levelRequirement: 100,
    goldPerTurn: 21000,
    defenseBonusPercentage: 105,
    cost: 250000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire',
    levelRequirement: 105,
    goldPerTurn: 22000,
    defenseBonusPercentage: 110,
    cost: 300000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire Level 2',
    levelRequirement: 110,
    goldPerTurn: 23000,
    defenseBonusPercentage: 115,
    cost: 350000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire Level 3',
    levelRequirement: 115,
    goldPerTurn: 24000,
    defenseBonusPercentage: 120,
    cost: 400000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
];

export const housingUpgrades: HousingUpgrade[] = [
  {
    name: 'Hovel',
    requiredFortificationLevel: 0,
    cost: 0,
    citizensPerDay: 1,
    type: 'housing',
  },
  {
    name: 'Hut',
    requiredFortificationLevel: 2,
    cost: 500000,
    citizensPerDay: 10,
    type: 'housing',
  },
  {
    name: 'Cottage',
    requiredFortificationLevel: 6,
    cost: 1000000,
    citizensPerDay: 20,
    type: 'housing',
  },
  {
    name: 'Longhouse',
    requiredFortificationLevel: 10,
    cost: 1500000,
    citizensPerDay: 30,
    type: 'housing',
  },
  {
    name: 'Manor House',
    requiredFortificationLevel: 14,
    cost: 2500000,
    citizensPerDay: 40,
    type: 'housing',
  },
  {
    name: 'Keep',
    requiredFortificationLevel: 18,
    cost: 3500000,
    citizensPerDay: 50,
    type: 'housing',
  },
  {
    name: 'Great Hall',
    requiredFortificationLevel: 22,
    cost: 5000000,
    citizensPerDay: 60,
    type: 'housing',
  },
];

export const structureUpgrades = {
  fortification: fortificationUpgrades,
  housing: housingUpgrades,
};

type bonusStats = {
  offense: number;
  defense: number;
  income: number;
  intelligence: number;
};

export const raceBonuses: { [key in PlayerRace]: bonusStats } = {
  human: {
    offense: 5,
    defense: 0,
    income: 0,
    intelligence: 0,
  },
  elf: {
    offense: 0,
    defense: 5,
    income: 0,
    intelligence: 0,
  },
  goblin: {
    offense: 0,
    defense: 5,
    income: 0,
    intelligence: 0,
  },
  undead: {
    offense: 5,
    defense: 0,
    income: 0,
    intelligence: 0,
  },
};

export const classBonuses: { [key in PlayerClass]: bonusStats } = {
  fighter: {
    offense: 5,
    defense: 0,
    income: 0,
    intelligence: 0,
  },
  cleric: {
    offense: 0,
    defense: 5,
    income: 0,
    intelligence: 0,
  },
  thief: {
    offense: 0,
    defense: 0,
    income: 5,
    intelligence: 0,
  },
  assassin: {
    offense: 0,
    defense: 0,
    income: 0,
    intelligence: 5,
  },
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
