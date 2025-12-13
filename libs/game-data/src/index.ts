// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  FortificationUpgrade,
  HousingUpgrade,
  StructureUpgradeType,
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

const MaxLevel = 100;
/**
 * Calculate the XP required for a specific level
 * This is a complexity of O(1) as it is a quadratic equation
 * Previously, the search was O(n) which was not efficient.
 * This also allows for an easy level cap change.
 * @param level
 * @returns number
 */
export const calculateLevelXP = (level: number): number => {
  if (level <= 1) return 0;
  // 500x^2 + 1500x - 1000 {x >= 2} where x is the level
  return Math.floor(500 * Math.pow(level, 2) + 1500 * level - 1000);
};

/**
 * Get the XP required for a specific level
 * @param level
 * @returns number
 */
export const getLevelXP = (level: number): number => {
  if (level < 1 || level > MaxLevel) {
    throw new Error(`Level must be between 1 and ${MaxLevel}`);
  }
  return calculateLevelXP(level);
};

/**
 * Calculate the level from a given XP value
 * This is a complexity of O(1) as it is a quadratic equation
 * @param xp
 * @returns number
 */
export const calculateLevelFromXP = (xp: number): number => {
  const a = 500;
  const b = 1500;
  const c = -1000;
  const _xp = !xp || isNaN(xp) ? 0 : xp;
  if (_xp < 0) {
    throw new Error('XP must be greater than or equal to 0');
  }

  if (_xp < 4000) {
    return 1;
  }

  // Adjust c to account for the XP value
  const adjustedC = c - _xp;

  // Calculate the discriminant
  const discriminant = b * b - 4 * a * adjustedC;

  if (discriminant < 0) {
    throw new Error('No valid level for the given XP');
  }

  // Calculate the two possible roots
  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  // Take the maximum valid root and round down
  const level = Math.floor(Math.max(root1, root2));

  // Ensure the level does not exceed MaxLevel
  return Math.min(level, MaxLevel);
};

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
    defenceBonusPercentage: 5,
    goldPerTurn: 10000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Village',
    levelRequirement: 5,
    goldPerTurn: 2000,
    defenceBonusPercentage: 10,
    cost: 100000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Town',
    levelRequirement: 10,
    goldPerTurn: 3000,
    defenceBonusPercentage: 15,
    cost: 250000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost',
    levelRequirement: 15,
    goldPerTurn: 4000,
    defenceBonusPercentage: 20,
    cost: 500000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost Level 2',
    levelRequirement: 20,
    goldPerTurn: 5000,
    defenceBonusPercentage: 25,
    cost: 1000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Outpost Level 3',
    levelRequirement: 25,
    goldPerTurn: 6000,
    defenceBonusPercentage: 30,
    cost: 2000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold',
    levelRequirement: 30,
    goldPerTurn: 7000,
    defenceBonusPercentage: 35,
    cost: 3000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold Level 2',
    levelRequirement: 35,
    goldPerTurn: 8000,
    defenceBonusPercentage: 40,
    cost: 4000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Stronghold Level 3',
    levelRequirement: 40,
    goldPerTurn: 9000,
    defenceBonusPercentage: 45,
    cost: 5000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress',
    levelRequirement: 45,
    goldPerTurn: 10000,
    defenceBonusPercentage: 50,
    cost: 7500000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress Level 2',
    levelRequirement: 50,
    goldPerTurn: 11000,
    defenceBonusPercentage: 55,
    cost: 10000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Fortress Level 3',
    levelRequirement: 55,
    goldPerTurn: 12000,
    defenceBonusPercentage: 60,
    cost: 15000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel',
    levelRequirement: 60,
    goldPerTurn: 13000,
    defenceBonusPercentage: 65,
    cost: 20000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel Level 2',
    levelRequirement: 65,
    goldPerTurn: 14000,
    defenceBonusPercentage: 70,
    cost: 30000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Citadel Level 3',
    levelRequirement: 70,
    goldPerTurn: 15000,
    defenceBonusPercentage: 75,
    cost: 40000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle',
    levelRequirement: 75,
    goldPerTurn: 16000,
    defenceBonusPercentage: 80,
    cost: 50000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle Level 2',
    levelRequirement: 80,
    goldPerTurn: 17000,
    defenceBonusPercentage: 85,
    cost: 75000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Castle Level 3',
    levelRequirement: 85,
    goldPerTurn: 18000,
    defenceBonusPercentage: 90,
    cost: 100000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom',
    levelRequirement: 90,
    goldPerTurn: 19000,
    defenceBonusPercentage: 95,
    cost: 150000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom Level 2',
    levelRequirement: 95,
    goldPerTurn: 20000,
    defenceBonusPercentage: 100,
    cost: 200000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Kingdom Level 3',
    levelRequirement: 100,
    goldPerTurn: 21000,
    defenceBonusPercentage: 105,
    cost: 250000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire',
    levelRequirement: 105,
    goldPerTurn: 22000,
    defenceBonusPercentage: 110,
    cost: 300000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire Level 2',
    levelRequirement: 110,
    goldPerTurn: 23000,
    defenceBonusPercentage: 115,
    cost: 350000000,
    requiredFortificationLevel: 0,
    type: 'fortification',
  },
  {
    name: 'Empire Level 3',
    levelRequirement: 115,
    goldPerTurn: 24000,
    defenceBonusPercentage: 120,
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

export const structureUpgrades: Record<StructureUpgradeType, object> = {
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
