import { levelXPArray } from '@darkthrone/game-data';

export interface ExperienceProgress {
  previousLevelXP: number;
  nextLevelXP: number;
  xpIntoLevel: number;
  xpRequiredForLevel: number;
  xpRemaining: number;
  xpProgress: number;
}

export function getExperienceProgress(
  level: number,
  experience: number,
): ExperienceProgress {
  const safeLevel = Math.max(1, level);
  const lastLevelIndex = levelXPArray.length - 1;
  const nextLevelIndex = Math.min(safeLevel - 1, lastLevelIndex);
  const previousLevelIndex = Math.max(0, nextLevelIndex - 1);
  const nextLevelXP = levelXPArray[nextLevelIndex] ?? 0;
  const previousLevelXP = safeLevel > 1 ? levelXPArray[previousLevelIndex] : 0;
  const xpRequiredForLevel = Math.max(1, nextLevelXP - previousLevelXP);
  const xpIntoLevel = Math.min(
    xpRequiredForLevel,
    Math.max(0, experience - previousLevelXP),
  );

  return {
    previousLevelXP,
    nextLevelXP,
    xpIntoLevel,
    xpRequiredForLevel,
    xpRemaining: Math.max(0, nextLevelXP - experience),
    xpProgress: nextLevelXP
      ? Math.min(100, (xpIntoLevel / xpRequiredForLevel) * 100)
      : 0,
  };
}
