import DarkThroneClient from '@darkthrone/client-library';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerObject, WarHistoryObject } from '@darkthrone/interfaces';
import {
  AsyncPageState,
  RetryPageState,
} from '../../../../components/async-page-state';
import { Button } from '@darkthrone/shadcnui/button';

interface ListWarHistoryProps {
  client: DarkThroneClient;
}
export default function ListWarHistory(props: ListWarHistoryProps) {
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState<WarHistoryObject[]>([]);
  const [players, setPlayers] = useState<PlayerObject[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  const loadHistory = useCallback(async () => {
    setStatus('loading');

    try {
      const historyFetch = await props.client.warHistory.fetchAll();
      setHistoryItems(historyFetch);

      const attackerIDs = historyFetch.map(
        (historyItem) => historyItem.attackerID,
      );
      const defenderIDs = historyFetch.map(
        (historyItem) => historyItem.defenderID,
      );
      const playerIDsUnique = [...new Set([...attackerIDs, ...defenderIDs])];

      if (playerIDsUnique.length === 0) {
        setPlayers([]);
        setStatus('ready');
        return;
      }

      const playersFetch =
        await props.client.players.fetchAllMatchingIDs(playerIDsUnique);

      setPlayers(playersFetch);
      setStatus('ready');
    } catch {
      setHistoryItems([]);
      setPlayers([]);
      setStatus('error');
    }
  }, [props.client.players, props.client.warHistory]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  function getNameForID(id: string) {
    const player = players.find((player) => player.id === id);
    if (!player) return 'Unknown';
    return player.name;
  }

  if (status === 'loading') {
    return (
      <AsyncPageState
        variant="loading"
        title="Loading war history"
        description="Fetching your recent battle reports."
      />
    );
  }

  if (status === 'error') {
    return (
      <RetryPageState
        title="We couldn't load your war history"
        description="A request failed while loading your battle reports. Try again or return to your home page."
        onRetry={() => {
          void loadHistory();
        }}
        secondaryActions={
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to home
          </Button>
        }
      />
    );
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="px-0 sm:px-6 lg:px-8">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:py-2 align-middle">
            <table className="min-w-full border border-card-border border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border w-32"
                  >
                    Gold Stolen
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-medium bg-card text-card-foreground/80 border-b border-card-border w-32"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((historyItem, historyItemIdx) => (
                  <tr
                    key={historyItemIdx}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => {
                      navigate(`/war-history/${historyItem.id}`);
                    }}
                  >
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/40">
                      <span className="font-bold text-foreground">
                        {getNameForID(historyItem.attackerID)}
                      </span>{' '}
                      attacks{' '}
                      <span className="font-bold text-foreground">
                        {getNameForID(historyItem.defenderID)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                      {new Intl.NumberFormat('en-GB').format(
                        historyItem.goldStolen,
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium border-b text-foreground/75">
                      <span className="block sm:hidden">
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'short',
                        }).format(new Date(historyItem.createdAt))}
                      </span>
                      <span className="hidden sm:block">
                        {new Date(historyItem.createdAt).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
