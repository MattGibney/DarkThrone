import DarkThroneClient from '@darkthrone/client-library';
import { PlayerObject } from '@darkthrone/interfaces';
import { Alert, Avatar, Button } from '@darkthrone/react-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  attackableLevels,
  attackableMaxLevel,
  attackableMinLevel,
} from '@darkthrone/game-data';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

interface AttackPlayerPageProps {
  client: DarkThroneClient;
}
export default function AttackPlayerPage(props: AttackPlayerPageProps) {
  const navigate = useNavigate();
  const { playerID } = useParams<{ playerID: string }>();

  const [player, setPlayer] = useState<PlayerObject | null | undefined>(
    undefined,
  );
  const [attackTurns, setAttackTurns] = useState<number>(1);
  const [invalidMessages, setInvalidMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerID === undefined) {
        setPlayer(null);
        return;
      }

      const playerFetch = await props.client.players.fetchByID(playerID);

      if (playerFetch.status === 'fail') {
        setPlayer(null);
        return;
      }

      setPlayer(playerFetch.data);
    };
    fetchPlayer();
  }, [playerID, props.client.players]);

  async function handleAttack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!attackTurns || attackTurns < 1 || attackTurns > 10) {
      setInvalidMessages([
        t('errors.invalidAttackTurnsMinMax', { ns: 'attack' }),
      ]);
      return;
    }

    if (!player) return;

    const attackResponse = await props.client.attack.attackPlayer(
      player.id,
      attackTurns,
    );
    if (attackResponse.status === 'fail') {
      setInvalidMessages(
        attackResponse.data.map((error) => t(error.title, { ns: 'errors' })),
      );
      return;
    }

    if (attackResponse.data.isAttackerVictor) {
      props.client.emit('playerUpdate');
    }

    navigate(`/war-history/${attackResponse.data.id}`);
  }

  if (player === undefined) return;

  if (player === null) {
    return (
      <div>
        <Trans i18nKey="errors.playerNotFound" ns="attack" />
      </div>
    );
  }

  const isViewingSelf = player.id === props.client.authenticatedPlayer?.id;

  if (isViewingSelf) {
    return (
      <div>
        <Trans i18nKey="errors.noSelfAttack" ns="attack" />
      </div>
    );
  }

  const currentPlayerLevel = props.client.authenticatedPlayer?.level || 0;
  const isAttackable = attackableLevels(player.level, currentPlayerLevel);

  if (!isAttackable) {
    return (
      <div>
        <Trans
          i18nKey="errors.invalidAttackPlayerLevel"
          ns="attack"
          values={{
            minLevel: attackableMinLevel(currentPlayerLevel),
            maxLevel: attackableMaxLevel(currentPlayerLevel),
          }}
        />
      </div>
    );
  }

  return (
    <div className="my-12 w-full max-w-2xl mx-auto rounded-md overflow-hidden">
      <div className="bg-zinc-800/50 p-8">
        <div className="flex items-center">
          <div className="grow flex items-center gap-x-4">
            <Avatar race={player.race} url={player.avatarURL} />
            <div>
              <div className="text-sm font-bold text-zinc-400">
                <Trans i18nKey="attack" />
              </div>
              <div className="grow text-2xl font-semibold text-zinc-200">
                {player.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-zinc-400">
              <Trans i18nKey="currentTurns" />
            </div>
            <div className="text-2xl font-light">
              {Intl.NumberFormat('en-GB').format(
                props.client.authenticatedPlayer?.attackTurns || 0,
              )}
            </div>
          </div>
        </div>
      </div>
      <form
        className="flex flex-col gap-y-6 bg-zinc-800 p-8"
        onSubmit={handleAttack}
      >
        {invalidMessages.length > 0 ? (
          <Alert
            messages={invalidMessages.map((err) => t(err, { ns: 'errors' }))}
            type={'error'}
          />
        ) : null}
        <div className="flex justify-between items-center">
          <div>
            <Trans i18nKey="attackturns" />{' '}
            <span className="text-sm text-zinc-400">(1 / 10)</span>
          </div>
          <input
            type="number"
            value={attackTurns.toString()}
            onChange={(e) => setAttackTurns(parseInt(e.target.value) || 0)}
            onFocus={() => setInvalidMessages([])}
            className="rounded-md border-0 py-1.5 bg-zinc-700 text-zinc-200 ring-1 ring-inset ring-zinc-500 focus:ring-2 focus:ring-inset focus:ring-yellow-600 invalid:ring-red-600 sm:text-sm sm:leading-6"
            min={1}
            max={10}
          />
        </div>
        <div className="flex justify-end gap-x-4">
          <div>
            <Button
              text={t('cancel')}
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
            />
          </div>
          <div>
            <Button text={t('attack')} type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}
