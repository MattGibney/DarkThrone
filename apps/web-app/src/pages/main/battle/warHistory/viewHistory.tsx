import DarkThroneClient from '@darkthrone/client-library';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar } from '../../../../components/avatar';
import { PlayerObject, WarHistoryObject } from '@darkthrone/interfaces';

interface WarHistoryViewProps {
  client: DarkThroneClient;
}
export default function WarHistoryView(props: WarHistoryViewProps) {
  const { historyID } = useParams<{ historyID: string }>();

  const [history, setHistory] = useState<WarHistoryObject | null>(null);
  const [attackingPlayer, setAttackingPlayer] = useState<PlayerObject | null>(
    null,
  );
  const [defendingPlayer, setDefendingPlayer] = useState<PlayerObject | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!historyID) return;

      try {
        const historyFetch = await props.client.warHistory.fetchByID(historyID);
        setHistory(historyFetch);

        const attackingPlayerFetch = await props.client.players.fetchByID(
          historyFetch.attackerID,
        );
        setAttackingPlayer(attackingPlayerFetch);

        const defendingPlayerFetch = await props.client.players.fetchByID(
          historyFetch.defenderID,
        );
        setDefendingPlayer(defendingPlayerFetch);
      } catch {
        setHistory(null);
        setAttackingPlayer(null);
        setDefendingPlayer(null);
      }
    };
    fetchData();
  }, [props.client.warHistory, historyID, props.client.players]);

  return (
    <main className="mx-auto max-w-4xl">
      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <div className="p-8 flex justify-center">
          <div className="w-1/4">
            <div>
              <Avatar
                url={attackingPlayer?.avatarURL}
                race={attackingPlayer?.race}
                size="fill"
                variant="square"
              />
            </div>
            <div className="text-center font-bold text-card-foreground mt-2">
              {attackingPlayer?.name}
            </div>
          </div>

          <div className="font-bold text-xs text-card-foreground/50 p-6 flex flex-col justify-center">
            VS
          </div>

          <div className="w-1/4">
            <div>
              <Avatar
                url={defendingPlayer?.avatarURL}
                race={defendingPlayer?.race}
                size="fill"
                variant="square"
              />
            </div>
            <div className="text-center font-bold text-card-foreground mt-2">
              {defendingPlayer?.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-3 bg-muted text-card-foreground p-8">
          <p>
            <span className="text-card-foreground font-semibold">
              {attackingPlayer?.name}
            </span>{' '}
            attacked{' '}
            <span className="text-card-foreground font-semibold">
              {defendingPlayer?.name}
            </span>
          </p>
          <p>{history?.attackTurnsUsed} attack turn(s) were used</p>
          <p>
            <span className="text-card-foreground font-semibold">
              {attackingPlayer?.name}
            </span>{' '}
            had a strength of {history?.attackerStrength}
          </p>
          {history?.defenderStrength !== undefined ? (
            <p>
              <span className="text-card-foreground font-semibold">
                {defendingPlayer?.name}
              </span>{' '}
              had a strength of {history?.defenderStrength}
            </p>
          ) : null}
          <p>
            <span className="text-card-foreground font-semibold">
              {history?.isAttackerVictor
                ? attackingPlayer?.name
                : defendingPlayer?.name}
            </span>{' '}
            was victorous
          </p>
        </div>
      </div>
    </main>
  );
}
