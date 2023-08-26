import DarkThroneClient, { PlayerObject } from '@darkthrone/client-library';
import { classNames } from '../../../utils';
import { useEffect, useState } from 'react';
import { Avatar } from '@darkthrone/react-components';

interface AttackListPageProps {
  client: DarkThroneClient;
}
export default function AttackListPage(props: AttackListPageProps) {
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const playersFetch = await props.client.players.fetchAllPlayers();
      if (playersFetch.status === 'fail') {
        console.error(playersFetch.data);
        return;
      }
      setPlayers(playersFetch.data);
    }
    fetchPlayers();
  }, [props.client.players]);


  return (
    <div className="sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500">
                  Name
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32">
                  Race
                </th>
              </tr>
              </thead>
              <tbody>
                {players.map((player, playerIdx) => (
                  <tr
                    key={playerIdx}
                    className='even:bg-zinc-800/50'
                  >
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                      <Avatar
                        race={player.race}
                        size='small'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
