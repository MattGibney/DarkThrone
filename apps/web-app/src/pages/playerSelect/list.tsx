import DarkThroneClient from '@darkthrone/client-library';
import type {
  ExtractErrorCodesForStatuses,
  GET_fetchPlayersForUser,
  PlayerObject,
  POST_assumePlayer,
} from '@darkthrone/interfaces';
import { Logo } from '@darkthrone/react-components';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Button } from '@darkthrone/shadcnui/button';
import { AlertCircleIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar';

type PlayerListErrorCode =
  ExtractErrorCodesForStatuses<GET_fetchPlayersForUser>;
type AssumePlayerErrorCode = ExtractErrorCodesForStatuses<POST_assumePlayer>;
type FetchStatus = 'loading' | 'success' | 'error';

const playerListErrorTranslations: Record<PlayerListErrorCode, string> = {
  'auth.unauthorized': 'Your session expired. Please sign in again.',
  'auth.forbidden': 'You do not have permission to view your players.',
  'server.error': 'We could not load your players. Please try again.',
};

const assumePlayerErrorTranslations: Record<AssumePlayerErrorCode, string> = {
  'auth.unauthorized': 'Your session expired. Please sign in again.',
  'auth.forbidden': 'You do not have permission to switch players.',
  'auth.assumePlayer.missingParams':
    'We could not switch to that player. Please try again.',
  'auth.assumePlayer.notAllowed':
    'That player does not belong to your account.',
  'auth.assumePlayer.notFound':
    'That player could not be found. Refresh and try again.',
  'server.error': 'We could not switch players. Please try again.',
};

function getErrorMessages<T extends string>(
  error: unknown,
  translations: Partial<Record<T, string>>,
  fallbackMessage: string,
): string[] {
  if (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors?: unknown }).errors)
  ) {
    const messages = (error as { errors?: unknown[] }).errors
      ?.filter((code): code is T => typeof code === 'string')
      .map((code) => translations[code] ?? fallbackMessage)
      .filter((message, index, allMessages) => {
        return allMessages.indexOf(message) === index;
      });

    if (messages && messages.length > 0) {
      return messages;
    }
  }

  return [fallbackMessage];
}

interface PlayerSelectListPageProps {
  client: DarkThroneClient;
}
export default function PlayerSelectListPage(props: PlayerSelectListPageProps) {
  const navigate = useNavigate();

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('loading');
  const [players, setPlayers] = useState<PlayerObject[]>([]);
  const [fetchErrorMessages, setFetchErrorMessages] = useState<string[]>([]);
  const [pendingPlayerID, setPendingPlayerID] = useState<string | null>(null);
  const [assumePlayerErrorMessages, setAssumePlayerErrorMessages] = useState<
    string[]
  >([]);

  async function loadPlayers() {
    try {
      setFetchStatus('loading');
      setFetchErrorMessages([]);

      const playersFetch = await props.client.players.fetchAllPlayersForUser();

      setPlayers(playersFetch);
      setFetchStatus('success');
    } catch (error) {
      console.error('Error fetching players for user:', error);
      setFetchErrorMessages(
        getErrorMessages(
          error,
          playerListErrorTranslations,
          playerListErrorTranslations['server.error'],
        ),
      );
      setFetchStatus('error');
    }
  }

  useEffect(() => {
    void loadPlayers();
  }, [props.client.players]);

  async function handleChoosePlayer(player: PlayerObject) {
    try {
      setPendingPlayerID(player.id);
      setAssumePlayerErrorMessages([]);

      await props.client.auth.assumePlayer(player.id);

      navigate('/overview');
    } catch (error) {
      setAssumePlayerErrorMessages(
        getErrorMessages(
          error,
          assumePlayerErrorTranslations,
          assumePlayerErrorTranslations['server.error'],
        ),
      );
      setPendingPlayerID(null);
    }
  }

  const isAssumingPlayer = pendingPlayerID !== null;

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo variant="large" />
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-120">
        <div className="bg-muted sm:rounded-t-lg px-6 py-12 sm:px-12">
          {fetchStatus === 'loading' ? (
            <div className="py-10 text-center" aria-live="polite">
              <p className="text-lg font-semibold text-foreground">
                Loading your players...
              </p>
              <p className="mt-2 text-sm text-foreground/70">
                Checking your account for existing characters.
              </p>
            </div>
          ) : fetchStatus === 'error' ? (
            <div className="space-y-4">
              <Alert variant="destructive" className="[&>svg]:size-4">
                <AlertCircleIcon />
                <AlertTitle>Unable to load your players</AlertTitle>
                <AlertDescription>
                  <ul className="list-inside list-disc text-sm">
                    {fetchErrorMessages.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={() => void loadPlayers()}>
                  Retry
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/player-select/create')}
                >
                  Create a new player
                </Button>
              </div>
            </div>
          ) : players.length === 0 ? (
            <div className="space-y-6 py-4 text-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  You don&apos;t have any players yet.
                </h2>
                <p className="text-sm text-foreground/70">
                  Create your first character to enter DarkThrone.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => navigate('/player-select/create')}
                className="w-full py-7 border-0"
                size="lg"
              >
                Create a new player
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {assumePlayerErrorMessages.length > 0 ? (
                <Alert variant="destructive" className="[&>svg]:size-4">
                  <AlertCircleIcon />
                  <AlertTitle>Unable to switch players</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      {assumePlayerErrorMessages.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : null}

              <div aria-busy={isAssumingPlayer}>
                {players.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    className="w-full text-left relative flex justify-between items-center gap-x-6 px-4 py-5 hover:bg-background/25 active:bg-background/35 rounded-lg sm:px-6"
                    onClick={() => void handleChoosePlayer(player)}
                    disabled={isAssumingPlayer}
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
                      {pendingPlayerID === player.id ? (
                        <span className="text-sm text-foreground/50">
                          Entering...
                        </span>
                      ) : (
                        <ChevronRightIcon
                          className="h-5 w-5 flex-none text-foreground/50"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative">
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

              <Button
                type="button"
                onClick={() => navigate('/player-select/create')}
                variant="outline"
                className="w-full py-7 border-0"
                size="lg"
                disabled={isAssumingPlayer}
              >
                Create a new player
              </Button>
            </div>
          )}
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
