import DarkThroneClient from '@darkthrone/client-library';
import { PlayerObject } from '@darkthrone/interfaces';
import { Logo } from '@darkthrone/react-components';
import { Avatar } from '../../components/avatar';
import { Button } from '@darkthrone/shadcnui/button';
import { ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PlayerSelectListPageProps {
  client: DarkThroneClient;
}
export default function PlayerSelectListPage(props: PlayerSelectListPageProps) {
  const navigate = useNavigate();

  const [didLoad, setDidLoad] = useState(false);
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const playersFetch =
          await props.client.players.fetchAllPlayersForUser();

        setDidLoad(true);
        setPlayers(playersFetch);
      } catch (error) {
        console.error('Error fetching players for user:', error);
      }
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
        <div className="flex justify-center">
          <Logo variant="large" />
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-120">
        <div className="bg-muted sm:rounded-t-lg px-6 py-12 sm:px-12">
          {players.length > 0 ? (
            <>
              <div>
                {players.map((player) => (
                  <button
                    key={player.id}
                    className="w-full text-left relative flex justify-between items-center gap-x-6 px-4 py-5 hover:bg-background/25 active:bg-background/35 rounded-lg sm:px-6"
                    onClick={() => handleChoosePlayer(player)}
                  >
                    <div className="flex items-center min-w-0 gap-x-4">
                      <Avatar url={player.avatarURL} race={player.race} />

                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-foreground">
                          {player.name}
                        </p>
                        <p className="flex text-sm leading-5 text-foreground/50 capitalize">
                          {player.race} {player.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                      <ChevronRightIcon
                        className="h-5 w-5 flex-none text-foreground/50"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative my-6">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-foreground/15" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-muted px-2 text-sm text-foreground/40">
                    Or
                  </span>
                </div>
              </div>
            </>
          ) : null}

          <Button
            type="button"
            onClick={() => navigate('/player-select/create')}
            variant={players.length > 0 ? 'outline' : 'default'}
            className="w-full py-7 border-0"
            size={'lg'}
          >
            Create a new player
          </Button>
        </div>
        <div className="bg-muted/50 sm:rounded-b-lg p-6 sm:px-12 flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground/70">Signed in as</p>
            <p className="truncate text-sm font-bold text-foreground">
              {props.client.authenticatedUser?.email}
            </p>
          </div>

          <div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => props.client.auth.logout()}
              size={'lg'}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
