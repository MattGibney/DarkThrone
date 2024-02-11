import DarkThroneClient, { PlayerObject, WarHistoryObject } from '@darkthrone/client-library';
import { globalNavigation } from '../../../../app';
import SubNavigation from '../../../../components/layout/subNavigation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ListWarHistoryProps {
  client: DarkThroneClient;
}
export default function ListWarHistory(props: ListWarHistoryProps) {
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState<WarHistoryObject[]>([]);
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const historyFetch = await props.client.warHistory.fetchAll();
      if (historyFetch.status === 'fail') {
        console.error(historyFetch.data);
        return;
      }
      setHistoryItems(historyFetch.data);

      const attackerIDs = historyFetch.data.map((historyItem) => historyItem.attackerID);
      const defenderIDs = historyFetch.data.map((historyItem) => historyItem.defenderID);
      const playerIDs = [...attackerIDs, ...defenderIDs];
      const playerIDsUnique = [...new Set(playerIDs)];

      const playersFetch = await props.client.players.fetchAllMatchingIDs(playerIDsUnique);
      if (playersFetch.status === 'fail') {
        console.error(playersFetch.data);
        return;
      }
      setPlayers(playersFetch.data);
    }
    fetchData();
  }, [props.client.warHistory]);

  function getNameForID(id: string) {
    const player = players.find((player) => player.id === id);
    if (!player) return 'Unknown';
    return player.name;
  }

  return (
    <main>
      <SubNavigation />
      <div className="sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500">
                    Description
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32">
                    Gold Stolen
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32">
                    Date
                  </th>
                </tr>
                </thead>
                <tbody>
                  {historyItems.map((historyItem, historyItemIdx) => (
                    <tr
                      key={historyItemIdx}
                      className='even:bg-zinc-800/50 cursor-pointer'
                      onClick={() => {
                        navigate(`/war-history/${historyItem.id}`)
                      }}
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-400">
                        <span className='font-bold text-white'>{getNameForID(historyItem.attackerID)}</span> attacks <span className='font-bold text-white'>{getNameForID(historyItem.defenderID)}</span>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {new Intl.NumberFormat('en-GB').format(historyItem.goldStolen)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {new Date(historyItem.createdAt).toLocaleString()}
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
