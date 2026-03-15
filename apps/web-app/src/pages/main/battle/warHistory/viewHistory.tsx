import DarkThroneClient from '@darkthrone/client-library';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '../../../../components/avatar';
import { PlayerObject, WarHistoryObject } from '@darkthrone/interfaces';
import {
  AsyncPageState,
  RetryPageState,
} from '../../../../components/async-page-state';
import { hasAPIErrorCode } from '../../../../libs/apiErrors';
import { Button } from '@darkthrone/shadcnui/button';

interface WarHistoryViewProps {
  client: DarkThroneClient;
}
export default function WarHistoryView(props: WarHistoryViewProps) {
  const navigate = useNavigate();
  const { historyID } = useParams<{ historyID: string }>();

  const [history, setHistory] = useState<WarHistoryObject | null>(null);
  const [attackingPlayer, setAttackingPlayer] = useState<PlayerObject | null>(
    null,
  );
  const [defendingPlayer, setDefendingPlayer] = useState<PlayerObject | null>(
    null,
  );
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'notFound' | 'error'
  >('loading');
  const [notFoundMessage, setNotFoundMessage] = useState(
    'That battle report could not be found.',
  );

  const loadHistory = useCallback(async () => {
    if (!historyID) {
      setHistory(null);
      setAttackingPlayer(null);
      setDefendingPlayer(null);
      setNotFoundMessage('That battle report could not be found.');
      setStatus('notFound');
      return;
    }

    setStatus('loading');
    setNotFoundMessage('That battle report could not be found.');

    try {
      const historyFetch = await props.client.warHistory.fetchByID(historyID);
      const [attackingPlayerFetch, defendingPlayerFetch] = await Promise.all([
        props.client.players.fetchByID(historyFetch.attackerID),
        props.client.players.fetchByID(historyFetch.defenderID),
      ]);

      setHistory(historyFetch);
      setAttackingPlayer(attackingPlayerFetch);
      setDefendingPlayer(defendingPlayerFetch);
      setStatus('ready');
    } catch (error) {
      setHistory(null);
      setAttackingPlayer(null);
      setDefendingPlayer(null);

      if (hasAPIErrorCode(error, 'warHistory.fetchByID.notFound')) {
        setNotFoundMessage('That battle report could not be found.');
        setStatus('notFound');
        return;
      }

      if (hasAPIErrorCode(error, 'warHistory.fetchByID.invalidID')) {
        setNotFoundMessage('This battle report link is invalid.');
        setStatus('notFound');
        return;
      }

      if (hasAPIErrorCode(error, 'player.fetchByID.notFound')) {
        setNotFoundMessage(
          'This battle report references a player that could not be found.',
        );
        setStatus('notFound');
        return;
      }

      setStatus('error');
    }
  }, [historyID, props.client.players, props.client.warHistory]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  if (status === 'loading') {
    return (
      <AsyncPageState
        variant="loading"
        title="Loading battle report"
        description="Fetching the combat log and player details for this war history entry."
      />
    );
  }

  if (status === 'notFound') {
    return (
      <AsyncPageState
        variant="notFound"
        title="Battle report unavailable"
        description={notFoundMessage}
        actions={
          <Button variant="outline" onClick={() => navigate('/war-history')}>
            Back to war history
          </Button>
        }
      />
    );
  }

  if (status === 'error') {
    return (
      <RetryPageState
        title="We couldn't load this battle report"
        description="A request failed while loading the combat log. Try again or return to your war history."
        onRetry={() => {
          void loadHistory();
        }}
        secondaryActions={
          <Button variant="outline" onClick={() => navigate('/war-history')}>
            Back to war history
          </Button>
        }
      />
    );
  }

  if (!history || !attackingPlayer || !defendingPlayer) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <div className="p-8 flex justify-center">
          <div className="w-1/4">
            <div>
              <Avatar
                url={attackingPlayer.avatarURL}
                race={attackingPlayer.race}
                size="fill"
                variant="square"
              />
            </div>
            <div className="text-center font-bold text-card-foreground mt-2">
              {attackingPlayer.name}
            </div>
          </div>

          <div className="font-bold text-xs text-card-foreground/50 p-6 flex flex-col justify-center">
            VS
          </div>

          <div className="w-1/4">
            <div>
              <Avatar
                url={defendingPlayer.avatarURL}
                race={defendingPlayer.race}
                size="fill"
                variant="square"
              />
            </div>
            <div className="text-center font-bold text-card-foreground mt-2">
              {defendingPlayer.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-3 bg-muted text-card-foreground p-8">
          <p>
            <span className="text-card-foreground font-semibold">
              {attackingPlayer.name}
            </span>{' '}
            attacked{' '}
            <span className="text-card-foreground font-semibold">
              {defendingPlayer.name}
            </span>
          </p>
          <p>{history.attackTurnsUsed} attack turn(s) were used</p>
          <p>
            <span className="text-card-foreground font-semibold">
              {attackingPlayer.name}
            </span>{' '}
            had a strength of {history.attackerStrength}
          </p>
          {history.defenderStrength !== undefined ? (
            <p>
              <span className="text-card-foreground font-semibold">
                {defendingPlayer.name}
              </span>{' '}
              had a strength of {history.defenderStrength}
            </p>
          ) : null}
          <p>
            <span className="text-card-foreground font-semibold">
              {history.isAttackerVictor
                ? attackingPlayer.name
                : defendingPlayer.name}
            </span>{' '}
            was victorous
          </p>
        </div>
      </div>
    </main>
  );
}
