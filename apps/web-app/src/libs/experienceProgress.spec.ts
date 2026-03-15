import { getExperienceProgress } from './experienceProgress';

describe('experienceProgress', () => {
  it('uses the full level one band for progress', () => {
    expect(getExperienceProgress(1, 1_000)).toEqual({
      previousLevelXP: 0,
      nextLevelXP: 4_000,
      xpIntoLevel: 1_000,
      xpRequiredForLevel: 4_000,
      xpRemaining: 3_000,
      xpProgress: 25,
    });
  });

  it('measures higher levels from the previous threshold instead of lifetime XP', () => {
    expect(getExperienceProgress(2, 5_000)).toEqual({
      previousLevelXP: 4_000,
      nextLevelXP: 8_000,
      xpIntoLevel: 1_000,
      xpRequiredForLevel: 4_000,
      xpRemaining: 3_000,
      xpProgress: 25,
    });
  });

  it('caps progress and remaining XP at the level threshold', () => {
    expect(getExperienceProgress(2, 8_000)).toEqual({
      previousLevelXP: 4_000,
      nextLevelXP: 8_000,
      xpIntoLevel: 4_000,
      xpRequiredForLevel: 4_000,
      xpRemaining: 0,
      xpProgress: 100,
    });
  });
});
