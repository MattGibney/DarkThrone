import DarkThroneClient from '@darkthrone/client-library';
import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@darkthrone/shadcnui/sidebar';

interface HeaderBarProps {
  client: DarkThroneClient;
}
export default function HeaderBar(props: HeaderBarProps) {
  const [currentTime, setCurrentTime] = useState(
    props.client.serverTime ? new Date(props.client.serverTime) : undefined,
  );
  const [timeRemaining, setTimeRemaining] = useState(
    props.client.serverTime
      ? calculateTimeRemaining(props.client.serverTime)
      : undefined,
  );

  props.client.on('updateCurrentUser', async () => {
    setCurrentTime(
      props.client.serverTime ? new Date(props.client.serverTime) : undefined,
    );
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!currentTime) return;
      const newTime = new Date(currentTime.getTime() + 1000);

      setCurrentTime(newTime);
      setTimeRemaining(calculateTimeRemaining(newTime));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentTime]);

  function calculateTimeRemaining(serverTime: Date) {
    const minutes = serverTime.getMinutes();
    const seconds = serverTime.getSeconds();

    const halfHourInSeconds = 60 * 30;

    const timeInSeconds = minutes * 60 + seconds;
    const timeSinceHourOrHalfHourInSeconds = timeInSeconds % halfHourInSeconds;
    const timeToHourOrHalfHourInSeconds =
      halfHourInSeconds - timeSinceHourOrHalfHourInSeconds;

    const minutesRemaining = Math.floor(timeToHourOrHalfHourInSeconds / 60);
    const remainingSeconds = timeToHourOrHalfHourInSeconds % 60;

    return `${String(minutesRemaining).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  return (
    <div className="sticky top-0 z-40 flex h-15 shrink-0 items-center gap-x-4 bg-sidebar border-b border-sidebar-border px-4 sm:gap-x-6">
      <SidebarTrigger className="text-foreground/40 md:hidden" />

      {/* Separator */}
      <div className="h-6 w-px bg-foreground/10 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-x-6 self-stretch lg:gap-x-6">
        <div className="flex gap-x-4 text-sm text-foreground/70">
          {currentTime ? (
            <div>
              DarkThrone Time:{' '}
              <span className="text-foreground font-bold">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          ) : null}
          {timeRemaining ? (
            <div>
              Next Turn In:{' '}
              <span className="text-foreground font-bold">{timeRemaining}</span>
            </div>
          ) : null}
        </div>
        <div className="ml-auto" />
      </div>
    </div>
  );
}
