import DarkThroneClient from '@darkthrone/client-library';
import { Avatar } from '@darkthrone/react-components';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderBarProps {
  setSidebarOpen: (open: boolean) => void;
  client: DarkThroneClient;
}
export default function HeaderBar(props: HeaderBarProps) {
  const navigate = useNavigate();

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

  async function handleSwitchPlayer() {
    await props.client.auth.unassumePlayer();
    navigate('/player-select');
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-zinc-300 lg:hidden"
        onClick={() => props.setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-zinc-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-x-6 self-stretch lg:gap-x-6">
        <div className="flex gap-x-4 text-sm text-zinc-300">
          {currentTime ? (
            <div>
              DarkThrone Time:{' '}
              <span className="text-white font-bold">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          ) : null}
          {timeRemaining ? (
            <div>
              Next Turn In:{' '}
              <span className="text-white font-bold">{timeRemaining}</span>
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>

                <Avatar
                  race={props.client.authenticatedPlayer?.race}
                  url={props.client.authenticatedPlayer?.avatarURL}
                  size="small"
                />

                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-zinc-300"
                    aria-hidden="true"
                  >
                    {props.client.authenticatedPlayer?.name}
                    {(props.client.authenticatedPlayer
                      ?.remainingProficiencyPoints || 0) > 0 && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-red-500 inline-block" />
                    )}
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-zinc-300"
                    aria-hidden="true"
                  />
                </span>
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
              <MenuItem>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-[focus]:bg-zinc-800/50"
                  onClick={() => handleSwitchPlayer()}
                >
                  Switch Players
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-[focus]:bg-zinc-800/50"
                  onClick={() => navigate('/proficiency-points')}
                >
                  Proficiency Points
                  {(props.client.authenticatedPlayer
                    ?.remainingProficiencyPoints || 0) > 0 && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-red-500 inline-block" />
                  )}
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-[focus]:bg-zinc-800/50"
                  onClick={() => props.client.auth.logout()}
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}
