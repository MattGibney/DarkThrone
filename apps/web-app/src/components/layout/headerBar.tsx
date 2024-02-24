import DarkThroneClient from '@darkthrone/client-library';
import { Avatar } from '@darkthrone/react-components';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderBarProps {
  setSidebarOpen: (open: boolean) => void;
  client: DarkThroneClient;
}
export default function HeaderBar(props: HeaderBarProps) {
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(props.client.serverTime ? new Date(props.client.serverTime) : undefined);
  const [timeRemaining, setTimeRemaining] = useState(props.client.serverTime ? calculateTimeRemaining(props.client.serverTime) : undefined);

  props.client.on('updateCurrentUser', async () => {
    setCurrentTime(props.client.serverTime ? new Date(props.client.serverTime) : undefined);
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
    let minutesRemaining;

    if (minutes < 30) {
      minutesRemaining = 30 - minutes;
    } else if (minutes === 30) {
      minutesRemaining = 30;
    } else {
      minutesRemaining = 60 - minutes;
    }

    const secondsRemaining = 60 - seconds;
    return { minutes: minutesRemaining, seconds: secondsRemaining };
  }

  async function handleSwitchPlayer() {
    await props.client.auth.unassumePlayer();
    navigate('/player-select');
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-zinc-300 lg:hidden" onClick={() => props.setSidebarOpen(true)}>
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-zinc-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-x-6 self-stretch lg:gap-x-6">
        <div className='flex gap-x-4 text-sm text-zinc-300'>
          {currentTime ? (
            <div>
              DarkThrone Time: <span className='text-white font-bold'>{currentTime.toLocaleTimeString()}</span>
            </div>
          ) : null}
          {timeRemaining ? (
            <div>
              Next Turn In: <span className='text-white font-bold'>{`${timeRemaining.minutes}:${timeRemaining.seconds < 10 ? '0' : ''}${timeRemaining.seconds}`}</span>
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          {/* <button type="button" className="-m-2.5 p-2.5 text-zinc-300 hover:text-zinc-400">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}

          {/* Separator */}
          {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-700" aria-hidden="true" /> */}

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>

              <Avatar
                race={props.client.authenticatedPlayer?.race}
                url={props.client.authenticatedPlayer?.avatarURL}
                size="small"
              />

              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-zinc-300" aria-hidden="true">
                  {props.client.authenticatedPlayer?.name}
                </span>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-zinc-300" aria-hidden="true" />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-zinc-800 py-2 shadow-lg ring-1 ring-zinc-600/95 focus:outline-none">
                <Menu.Button
                  className='w-full items-center text-left rounded-md px-2 py-2 text-sm'
                  onClick={() => handleSwitchPlayer()}
                >
                  Switch Players
                </Menu.Button>
                <Menu.Button
                  className='w-full items-center text-left rounded-md px-2 py-2 text-sm'
                  onClick={() => props.client.auth.logout()}
                >
                  Logout
                </Menu.Button>
                {/* <Menu.Item>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-zinc-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-zinc-900'
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item> */}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
