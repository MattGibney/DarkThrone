// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  FortificationUpgrade,
  HousingUpgrade,
  StructureType,
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

/**
 * Create Fortification Upgrade
 * @param name
 * @param levelRequirement
 * @param cost
 * @param defenceBonusPercentage
 * @param goldPerTurn
 * @param requiredFortificationLevel
 * @returns FortificationUpgrade
 * @example
 * createFortificationUpgrade('Manor', 1, 0, 5, 1000, 0);
 * // returns { name: 'Manor', levelRequirement: 1, cost: 0, defenceBonusPercentage: 5, goldPerTurn: 1000, requiredFortificationLevel: 0, type: 'fortification' }
 */
const createFortificationUpgrade = (
  name: string,
  levelRequirement: number,
  cost: number,
  defenceBonusPercentage: number,
  goldPerTurn: number,
  requiredFortificationLevel: number,
): FortificationUpgrade => ({
  name,
  levelRequirement,
  cost,
  defenceBonusPercentage,
  goldPerTurn,
  requiredFortificationLevel,
  type: StructureType.FORTIFICATION,
});

const calculateFortificationLevelRequirement = (index: number): number =>
  index === 0 ? 1 : 5 * index;

const calculateFortificationDefenceBonusPercentage = (index: number): number =>
  5 * index + 5;

const calculateFortificationGoldPerTurn = (index: number): number =>
  1000 * index + 1000;

export const fortificationUpgrades: FortificationUpgrade[] = [
  { name: 'Manor', cost: 0 },
  { name: 'Village', cost: 100000 },
  { name: 'Town', cost: 250000 },
  { name: 'Outpost', cost: 500000 },
  { name: 'Outpost Level 2', cost: 1000000 },
  { name: 'Outpost Level 3', cost: 2000000 },
  { name: 'Stronghold', cost: 3000000 },
  { name: 'Stronghold Level 2', cost: 4000000 },
  { name: 'Stronghold Level 3', cost: 5000000 },
  { name: 'Fortress', cost: 7500000 },
  { name: 'Fortress Level 2', cost: 10000000 },
  { name: 'Fortress Level 3', cost: 15000000 },
  { name: 'Citadel', cost: 20000000 },
  { name: 'Citadel Level 2', cost: 30000000 },
  { name: 'Citadel Level 3', cost: 40000000 },
  { name: 'Castle', cost: 50000000 },
  { name: 'Castle Level 2', cost: 75000000 },
  { name: 'Castle Level 3', cost: 100000000 },
  { name: 'Kingdom', cost: 150000000 },
  { name: 'Kingdom Level 2', cost: 200000000 },
  { name: 'Kingdom Level 3', cost: 250000000 },
  { name: 'Empire', cost: 300000000 },
  { name: 'Empire Level 2', cost: 350000000 },
  { name: 'Empire Level 3', cost: 400000000 },
].map((upgrade, index) => {
  return createFortificationUpgrade(
    upgrade.name,
    calculateFortificationLevelRequirement(index),
    upgrade.cost, // I could not find a pattern for the cost without splitting into a very large piecewise function
    calculateFortificationDefenceBonusPercentage(index),
    calculateFortificationGoldPerTurn(index),
    0,
  );
});

/**
 * This is a factory function that creates a housing upgrade
 * @param name
 * @param requiredFortificationLevel
 * @param cost
 * @param citizensPerDay
 * @returns HousingUpgrade
 * @example
 * createHousingUpgrade('Hovel', 0, 0, 1);
 * // returns { name: 'Hovel', requiredFortificationLevel: 0, cost: 0, citizensPerDay: 1, type: 'housing' }
 */
const createHousingUpgrade = (
  name: string,
  requiredFortificationLevel: number,
  cost: number,
  citizensPerDay: number,
): HousingUpgrade => ({
  name,
  requiredFortificationLevel,
  cost,
  citizensPerDay,
  type: StructureType.HOUSING,
});

/**
 * Calculate the required fortification level for a housing upgrade
 * f(x)={x=0:0,x>0:4x-2}
 * @param index
 * @returns number
 */
const calculateHousingRequiredFortificationLevel = (index: number): number => {
  if (index === 0) return 0;
  return 4 * index - 2;
};

/**
 * Find the cost of housing using a piecewise function
 * f(x)={0<=x<=3:500000x,4<=x:250000x^2-1250000x+3500000}
 * @param index
 * @returns
 */
const calculateHousingCost = (index: number): number => {
  if (index <= 3) return 500000 * index;
  return 250000 * Math.pow(index, 2) - 1250000 * index + 3500000;
};

const calculateHousingCitizensPerDay = (index: number): number =>
  index === 0 ? 1 : 10 * index;

export const housingUpgrades: HousingUpgrade[] = [
  'Hovel',
  'Hut',
  'Cottage',
  'Longhouse',
  'Manor House',
  'Keep',
  'Great Hall',
].map((upgrade, index) => {
  return createHousingUpgrade(
    upgrade,
    calculateHousingRequiredFortificationLevel(index),
    calculateHousingCost(index),
    calculateHousingCitizensPerDay(index),
  );
});

export const structureUpgrades = {
  fortification: fortificationUpgrades,
  housing: housingUpgrades,
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
