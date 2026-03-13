import {
  TURN_INTERVAL_MS,
  formatTimeUntilNextTurn,
  getMillisecondsUntilNextTurn,
} from './turnTiming';

describe('turnTiming', () => {
  it('returns a full turn when the server time is exactly on a turn boundary', () => {
    const serverTime = new Date('2026-03-13T12:00:00.000Z');

    expect(getMillisecondsUntilNextTurn(serverTime)).toBe(TURN_INTERVAL_MS);
    expect(formatTimeUntilNextTurn(serverTime)).toBe('30:00');
  });

  it('returns the remaining milliseconds until the next half-hour turn', () => {
    const serverTime = new Date('2026-03-13T12:29:45.000Z');

    expect(getMillisecondsUntilNextTurn(serverTime)).toBe(15_000);
    expect(formatTimeUntilNextTurn(serverTime)).toBe('00:15');
  });

  it('rolls over correctly from the half-hour mark to the next hour', () => {
    const serverTime = new Date('2026-03-13T12:30:00.000Z');

    expect(getMillisecondsUntilNextTurn(serverTime)).toBe(TURN_INTERVAL_MS);
    expect(formatTimeUntilNextTurn(serverTime)).toBe('30:00');
  });
});
