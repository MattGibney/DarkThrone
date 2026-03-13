import DarkThroneClient from '@darkthrone/client-library';
import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@darkthrone/shadcnui/sidebar';
import { formatTimeUntilNextTurn } from '../../libs/turnTiming';

interface HeaderBarProps {
  client: DarkThroneClient;
}
export default function HeaderBar(props: HeaderBarProps) {
  const [currentTime, setCurrentTime] = useState(
    props.client.serverTime ? new Date(props.client.serverTime) : undefined,
  );

  useEffect(() => {
    setCurrentTime(
      props.client.serverTime ? new Date(props.client.serverTime) : undefined,
    );
  }, [props.client.serverTime?.getTime()]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime((previousTime) => {
        if (!previousTime) return previousTime;
        return new Date(previousTime.getTime() + 1000);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeRemaining = currentTime
    ? formatTimeUntilNextTurn(currentTime)
    : undefined;

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
