import DarkThroneClient from '@darkthrone/client-library';
import {
  ExtractErrorCodesForStatuses,
  PlayerObject,
  POST_attackPlayer,
} from '@darkthrone/interfaces';
import { Alert } from '@darkthrone/react-components';
import { Avatar } from '../../../../components/avatar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  attackableLevels,
  attackableMaxLevel,
  attackableMinLevel,
} from '@darkthrone/game-data';
import { Input } from '@darkthrone/shadcnui/input';
import { Button } from '@darkthrone/shadcnui/button';

type PossibleErrorCodes = ExtractErrorCodesForStatuses<
  POST_attackPlayer,
  400 | 404 | 500
>;

interface AttackPlayerPageProps {
  client: DarkThroneClient;
}
export default function AttackPlayerPage(props: AttackPlayerPageProps) {
  const navigate = useNavigate();

  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'attack.missingProps': 'A targetID and attackTurns are required.',
    'attack.invalidAttackTurns': 'Attack turns must be between 1 and 10.',
    'attack.notEnoughAttackTurns': 'You do not have enough attack turns.',
    'attack.noAttackStrength': 'You have no attack strength.',
    'attack.outsideRange': 'You cannot attack this player due to level range.',
    'attack.targetNotFound': 'Target player not found.',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const { playerID } = useParams<{ playerID: string }>();

  const [player, setPlayer] = useState<PlayerObject | null | undefined>(
    undefined,
  );
  const [attackTurns, setAttackTurns] = useState<number>(1);
  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerID === undefined) {
        setPlayer(null);
        return;
      }

      try {
        const playerFetch = await props.client.players.fetchByID(playerID);
        setPlayer(playerFetch);
      } catch {
        setPlayer(null);
      }
    };
    fetchPlayer();
  }, [playerID, props.client.players]);

  async function handleAttack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!attackTurns || attackTurns < 1 || attackTurns > 10) {
      setErrorMessages(['attack.invalidAttackTurns']);
      return;
    }

    if (!player) return;

    try {
      const attackResponse = await props.client.attack.attackPlayer(
        player.id,
        attackTurns,
      );

      if (attackResponse.isAttackerVictor) {
        props.client.emit('playerUpdate');
      }

      navigate(`/war-history/${attackResponse.id}`);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setErrorMessages(
          (error as { errors?: PossibleErrorCodes[] })
            .errors as PossibleErrorCodes[],
        );
      } else {
        setErrorMessages(['server.error']);
      }
    }
  }

  if (player === undefined) return;

  if (player === null) return <div>Player not found</div>;

  const isViewingSelf = player.id === props.client.authenticatedPlayer?.id;

  if (isViewingSelf) {
    return <div>You cannot attack yourself</div>;
  }

  const currentPlayerLevel = props.client.authenticatedPlayer?.level || 0;
  const isAttackable = attackableLevels(player.level, currentPlayerLevel);

  if (!isAttackable) {
    return (
      <div>
        You can only attack players with levels between{' '}
        {attackableMinLevel(currentPlayerLevel)} and{' '}
        {attackableMaxLevel(currentPlayerLevel)}
      </div>
    );
  }

  return (
    <div className="my-12 w-full max-w-2xl mx-auto rounded-md overflow-hidden">
      <div className="bg-muted/50 p-8">
        <div className="flex items-center">
          <div className="grow flex items-center gap-x-4">
            <Avatar race={player.race} url={player.avatarURL} />
            <div>
              <div className="text-sm font-bold text-foreground/50">Attack</div>
              <div className="grow text-2xl font-semibold text-foreground">
                {player.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-foreground/50">
              Current Turns
            </div>
            <div className="text-2xl font-medium">
              {Intl.NumberFormat('en-GB').format(
                props.client.authenticatedPlayer?.attackTurns || 0,
              )}
            </div>
          </div>
        </div>
      </div>
      <form
        className="flex flex-col gap-y-6 bg-muted p-8"
        onSubmit={handleAttack}
      >
        {errorMessages.length > 0 ? (
          <Alert
            messages={errorMessages.map((err) => errorTranslations[err])}
            type={'error'}
          />
        ) : null}
        <div className="flex justify-between items-center">
          <div>
            Attack Turns{' '}
            <span className="text-sm text-foreground/50">(1 / 10)</span>
          </div>
          <Input
            type="number"
            value={attackTurns.toString()}
            onChange={(e) => setAttackTurns(parseInt(e.target.value) || 0)}
            onFocus={() => setErrorMessages([])}
            className="w-32"
            min={1}
            max={10}
          />
        </div>
        <div className="flex justify-end gap-x-4">
          <div>
            <Button
              variant="outline"
              type="button"
              size={'lg'}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button type="submit" size={'lg'}>
              Attack
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
