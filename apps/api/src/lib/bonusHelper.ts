import { classBonuses, raceBonuses } from '@darkthrone/game-data';
import PlayerModel from '../models/player';

export function getAttackModifier(player: PlayerModel): number {
  let bonus = 0;
  bonus += raceBonuses[player.race]?.offense || 0;
  bonus += classBonuses[player.class]?.offense || 0;
  bonus += player.proficiencyPoints.strength;
  return bonus;
}

export function getIncomeModifier(player: PlayerModel): number {
  let bonus = 0;
  bonus += raceBonuses[player.race]?.income || 0;
  bonus += classBonuses[player.class]?.income || 0;
  bonus += player.proficiencyPoints.wealth;
  return bonus;
}

export function getCostModifier(player: PlayerModel): number {
  let bonus = 0;
  bonus += player.proficiencyPoints.charisma;
  return bonus;
}

export function getDefenseModifier(player: PlayerModel): number {
  let bonus = 0;
  bonus += raceBonuses[player.race]?.defense || 0;
  bonus += classBonuses[player.class]?.defense || 0;
  bonus += player.fortification.defenseBonusPercentage;
  bonus += player.proficiencyPoints.constitution;
  return bonus;
}

export function calculateIntBonus(
  isAdditive: boolean,
  ...bonuses: number[]
): number {
  let total = 0;
  bonuses.reduce((_acc, bonus) => (total += bonus), 0);
  isAdditive ? (total = 100 + total) : (total = 100 - total);
  return total;
}

export function applyBonuses(
  isAdditive: boolean,
  stat: number,
  ...bonus: number[]
): number {
  const bonusInt = calculateIntBonus(isAdditive, ...bonus);
  return Math.floor(stat * bonusInt) / 100;
}
