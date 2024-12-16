import DarkThroneClient, { WarHistoryObject } from '@darkthrone/client-library';
import SubNavigation from '../../../../components/layout/subNavigation';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar } from '@darkthrone/react-components';
import { PlayerObject } from '@darkthrone/interfaces';
import { Trans } from 'react-i18next';

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

      const historyFetch = await props.client.warHistory.fetchByID(historyID);
      if (historyFetch.status === 'fail') {
        console.error(historyFetch.data);
        return;
      }
      setHistory(historyFetch.data);

      const attackingPlayerFetch = await props.client.players.fetchByID(
        historyFetch.data.attackerID,
      );
      if (attackingPlayerFetch.status === 'fail') {
        console.error(attackingPlayerFetch.data);
        return;
      }
      setAttackingPlayer(attackingPlayerFetch.data);

      const defendingPlayerFetch = await props.client.players.fetchByID(
        historyFetch.data.defenderID,
      );
      if (defendingPlayerFetch.status === 'fail') {
        console.error(defendingPlayerFetch.data);
        return;
      }
      setDefendingPlayer(defendingPlayerFetch.data);
    };
    fetchData();
  }, [props.client.warHistory, historyID, props.client.players]);

  return (
    <main>
      <SubNavigation />
      <div className="my-12 w-full max-w-2xl mx-auto rounded-xl">
        <div className="bg-zinc-800/50 p-8 flex justify-center">
          <div className="w-1/4">
            <div>
              <Avatar
                url={attackingPlayer?.avatarURL}
                race={attackingPlayer?.race}
                size="fill"
                variant="square"
              />
            </div>
            <div className="text-center font-bold text-zinc-300 mt-2">
              {attackingPlayer?.name}
            </div>
          </div>

          <div className="font-bold text-xs text-zinc-400 p-6 flex flex-col justify-center">
            <Trans i18nKey="vs" ns="attack" />
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
            <div className="text-center font-bold text-zinc-300 mt-2">
              {defendingPlayer?.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-3 bg-zinc-800 text-zinc-300 p-8">
          <p>
            <Trans
              i18nKey="playerAttack"
              ns="attack"
              values={{
                attacker: attackingPlayer?.name,
                defender: defendingPlayer?.name,
              }}
            >
              <span className="text-white font-semibold"></span>
              <span className="text-white font-semibold"></span>
            </Trans>
          </p>
          <p>
            <Trans
              i18nKey="attackTurnsUsed"
              ns="attack"
              count={history?.attackTurnsUsed}
              values={{ turns: history?.attackTurnsUsed }}
            />
          </p>
          <p>
            <Trans
              i18nKey="playerStrength"
              ns="attack"
              values={{
                player: attackingPlayer?.name,
                strength: history?.attackerStrength,
              }}
            >
              <span className="text-white font-semibold"></span>
            </Trans>
          </p>
          {history?.defenderStrength !== undefined ? (
            <p>
              <Trans
                i18nKey="playerStrength"
                ns="attack"
                values={{
                  player: defendingPlayer?.name,
                  strength: history?.defenderStrength,
                }}
              >
                <span className="text-white font-semibold"></span>
              </Trans>
            </p>
          ) : null}
          <p>
            <Trans
              i18nKey="victorious"
              ns="attack"
              values={{
                player: history?.isAttackerVictor
                  ? attackingPlayer?.name
                  : defendingPlayer?.name,
              }}
            >
              <span className="text-white font-semibold"></span>
            </Trans>
          </p>
        </div>
      </div>
    </main>
  );
}
