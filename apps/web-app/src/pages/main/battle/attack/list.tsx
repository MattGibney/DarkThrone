import DarkThroneClient from '@darkthrone/client-library';
import { useEffect, useState } from 'react';
import { Avatar } from '@darkthrone/react-components';
import { useNavigate } from 'react-router-dom';
import SubNavigation from '../../../../components/layout/subNavigation';
import { PlayerObject } from '@darkthrone/interfaces';

interface AttackListPageProps {
  client: DarkThroneClient;
}
export default function AttackListPage(props: AttackListPageProps) {
  const navigate = useNavigate();
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
    <main>
      <SubNavigation />
      <div className="sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32">
                    Level
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32">
                    Gold
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
                      className='even:bg-zinc-800/50 cursor-pointer'
                      onClick={() => {
                        navigate(`/player/${player.id}`)
                      }}
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {player.name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {player.level}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {new Intl.NumberFormat('en-GB').format(player.gold)}
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
    </main>
  );
}
