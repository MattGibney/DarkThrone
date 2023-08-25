import DarkThroneClient, { PlayerObject } from '@darkthrone/client-library';
import { Alert, Avatar, Button, InputCheckbox, InputField } from '@darkthrone/react-components';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface PlayerSelectListPageProps {
  client: DarkThroneClient;
}
export default function PlayerSelectListPage(props: PlayerSelectListPageProps) {
  const navigate = useNavigate();

  const [didLoad, setDidLoad] = useState(false);
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  useEffect(() => {
    const getPlayers = async () => {
      const playersFetch = await props.client.players.fetchAllPlayers();

      setDidLoad(true);

      if (playersFetch.status === 'fail') {
        console.error('Failed to fetch players', playersFetch.data);
        return;
      }

      setPlayers(playersFetch.data);
    };

    getPlayers();
  }, [props.client.players]);

  async function handleChoosePlayer(player: PlayerObject) {
    await props.client.auth.assumePlayer(player.id);

    navigate('/overview');
  }

  if (!didLoad) return null;

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Player Select
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-gray-800 sm:rounded-t-lg px-6 py-12 sm:px-12">

          {players.length > 0 ? (
            <>
              <div>
                {players.map((player) => (
                  <button
                    key={player.id}
                    className="w-full text-left relative flex justify-between items-center gap-x-6 px-4 py-5 hover:bg-gray-700/50 rounded-lg sm:px-6"
                    onClick={() => handleChoosePlayer(player)}
                  >
                    <div className="flex items-center min-w-0 gap-x-4">

                      <Avatar url={player.avatarURL} race={player.race} />

                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-200 capitalize">
                          {player.name}
                        </p>
                        <p className="flex text-sm leading-5 text-gray-500 capitalize">
                          {player.race} {player.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                      <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-800 px-2 text-sm text-gray-500">Or</span>
                </div>
              </div>
            </>
          ) : null}

          <Button
            type='button'
            text={'Create a new player'}
            onClick={() => navigate('/player-select/create')}
            variant={players.length > 0 ? 'secondary' : 'primary'}
          />
          {/* <button className=' w-full p-6 rounded-lg'>
            Create a new player
          </button> */}

        </div>
        <div className="bg-black/25 sm:rounded-b-lg p-6 sm:px-12 flex justify-between items-center">

          <div>
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="truncate text-sm font-bold text-gray-200">{props.client.authenticatedUser?.email}</p>
          </div>

          <div>
            <Button
              text={'Logout'}
              variant='secondary'
              type='button'
              onClick={() => props.client.auth.logout()}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
