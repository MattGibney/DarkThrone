export const TURN_INTERVAL_MS = 30 * 60 * 1000;
export const TURN_REFRESH_BUFFER_MS = 2000;

export function getMillisecondsUntilNextTurn(serverTime: Date): number {
  const remainder = serverTime.getTime() % TURN_INTERVAL_MS;
  return remainder === 0 ? TURN_INTERVAL_MS : TURN_INTERVAL_MS - remainder;
}

export function formatTimeUntilNextTurn(serverTime: Date): string {
  const totalSeconds = Math.floor(
    getMillisecondsUntilNextTurn(serverTime) / 1000,
  );
  const minutesRemaining = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutesRemaining).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
