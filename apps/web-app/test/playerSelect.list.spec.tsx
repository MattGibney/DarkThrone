import type DarkThroneClient from '@darkthrone/client-library';
import type { PlayerObject, UserSessionObject } from '@darkthrone/interfaces';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlayerSelectListPage from '../src/pages/playerSelect/list';

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

const playerFixture: PlayerObject = {
  id: 'player-1',
  name: 'Aragorn',
  race: 'human',
  class: 'fighter',
  gold: 500,
  level: 3,
  overallRank: 8,
  armySize: 120,
};

const authenticatedUserFixture: UserSessionObject = {
  id: 'user-1',
  email: 'matt@example.com',
  hasConfirmedEmail: true,
  serverTime: '2026-03-15T12:00:00.000Z',
};

type MockClientOptions = {
  fetchAllPlayersForUser?: jest.Mock;
  assumePlayer?: jest.Mock;
  logout?: jest.Mock;
};

function createClient(options: MockClientOptions = {}) {
  return {
    players: {
      fetchAllPlayersForUser:
        options.fetchAllPlayersForUser ?? jest.fn().mockResolvedValue([]),
    },
    auth: {
      assumePlayer: options.assumePlayer ?? jest.fn(),
      logout: options.logout ?? jest.fn(),
    },
    authenticatedUser: authenticatedUserFixture,
  } as unknown as DarkThroneClient;
}

function renderPage(client: DarkThroneClient) {
  return render(
    <MemoryRouter initialEntries={['/player-select']}>
      <Routes>
        <Route
          path="/player-select"
          element={<PlayerSelectListPage client={client} />}
        />
        <Route
          path="/player-select/create"
          element={<div>Create Player</div>}
        />
        <Route path="/overview" element={<div>Overview</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PlayerSelectListPage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a visible loading state before the players request resolves', async () => {
    const deferredPlayers = createDeferred<PlayerObject[]>();
    const client = createClient({
      fetchAllPlayersForUser: jest.fn(() => deferredPlayers.promise),
    });

    renderPage(client);

    expect(screen.getByText('Loading your players...')).toBeTruthy();

    await act(async () => {
      deferredPlayers.resolve([playerFixture]);
      await deferredPlayers.promise;
    });

    expect(await screen.findByText('Aragorn')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByText('Loading your players...')).toBeNull();
    });
  });

  it('renders a retryable error state when the player list request fails', async () => {
    const fetchAllPlayersForUser = jest
      .fn()
      .mockRejectedValueOnce({ errors: ['server.error'] })
      .mockResolvedValueOnce([playerFixture]);
    const client = createClient({ fetchAllPlayersForUser });

    renderPage(client);

    expect(
      await screen.findByText(
        'We could not load your players. Please try again.',
      ),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByText('Loading your players...')).toBeTruthy();
    expect(await screen.findByText('Aragorn')).toBeTruthy();
    expect(fetchAllPlayersForUser).toHaveBeenCalledTimes(2);
  });

  it('renders an explicit empty state when the user has no players', async () => {
    const client = createClient({
      fetchAllPlayersForUser: jest.fn().mockResolvedValue([]),
    });

    renderPage(client);

    expect(
      await screen.findByText(/You don't have any players yet\./),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Create a new player' }),
    ).toBeTruthy();
  });

  it('disables player selection while assuming a player and shows inline failures', async () => {
    const assumePlayerDeferred = createDeferred<UserSessionObject>();
    const assumePlayer = jest.fn(() => assumePlayerDeferred.promise);
    const client = createClient({
      fetchAllPlayersForUser: jest.fn().mockResolvedValue([playerFixture]),
      assumePlayer,
    });

    renderPage(client);

    const choosePlayerButton = await screen.findByRole('button', {
      name: /aragorn/i,
    });

    fireEvent.click(choosePlayerButton);

    expect(assumePlayer).toHaveBeenCalledWith('player-1');
    expect((choosePlayerButton as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText('Entering...')).toBeTruthy();

    await act(async () => {
      assumePlayerDeferred.reject({ errors: ['auth.assumePlayer.notFound'] });

      try {
        await assumePlayerDeferred.promise;
      } catch {
        // The component handles the rejection and surfaces it in the UI.
      }
    });

    expect(
      await screen.findByText(
        'That player could not be found. Refresh and try again.',
      ),
    ).toBeTruthy();
    await waitFor(() => {
      expect(
        (screen.getByRole('button', { name: /aragorn/i }) as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });
    expect(screen.queryByText('Overview')).toBeNull();
  });
});
