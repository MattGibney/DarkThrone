import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AttackListPage from './attack/list';
import AttackViewPlayerPage from './attack/viewPlayer';
import ListWarHistory from './warHistory/listHistory';
import WarHistoryView from './warHistory/viewHistory';
import DarkThroneClient from '@darkthrone/client-library';
import { PlayerObject, WarHistoryObject } from '@darkthrone/interfaces';

jest.mock('@darkthrone/shadcnui/components/pagination', () => ({
  Pagination: () => null,
}));

const authenticatedPlayer: PlayerObject = {
  id: 'player-self',
  name: 'Commander',
  race: 'human',
  class: 'fighter',
  gold: 2500,
  level: 12,
  overallRank: 18,
  armySize: 750,
};

const targetPlayer: PlayerObject = {
  id: 'player-target',
  name: 'Enemy',
  race: 'elf',
  class: 'cleric',
  gold: 1500,
  level: 11,
  overallRank: 21,
  armySize: 500,
};

const warHistory: WarHistoryObject = {
  id: 'history-1',
  attackerID: authenticatedPlayer.id,
  defenderID: targetPlayer.id,
  isAttackerVictor: true,
  attackTurnsUsed: 3,
  attackerStrength: 900,
  defenderStrength: 650,
  goldStolen: 1200,
  createdAt: new Date('2026-03-15T10:00:00.000Z'),
};

// prettier-ignore
const attackListErrorTitle = 'We couldn\'t load the attack list';
// prettier-ignore
const playerLoadErrorTitle = 'We couldn\'t load this player';
// prettier-ignore
const warHistoryListErrorTitle = 'We couldn\'t load your war history';
// prettier-ignore
const warHistoryErrorTitle = 'We couldn\'t load this battle report';

function renderRoute(route: string, path: string, element: JSX.Element) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

function createClient(overrides?: Partial<DarkThroneClient>) {
  return {
    authenticatedPlayer,
    players: {
      fetchAllPlayers: jest.fn(),
      fetchByID: jest.fn(),
      fetchAllMatchingIDs: jest.fn(),
    },
    warHistory: {
      fetchAll: jest.fn(),
      fetchByID: jest.fn(),
    },
    emit: jest.fn(),
    ...overrides,
  } as unknown as DarkThroneClient;
}

describe('combat page states', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows loading, then surfaces an attack list failure, then retries successfully', async () => {
    const fetchAllPlayers = jest
      .fn()
      .mockRejectedValueOnce(new Error('server.error'))
      .mockResolvedValueOnce({
        items: [targetPlayer],
        meta: {
          totalItemCount: 1,
          totalPageCount: 1,
          page: 1,
          pageSize: 100,
        },
      });

    const client = createClient({
      players: {
        fetchAllPlayers,
      } as DarkThroneClient['players'],
    });

    renderRoute('/attack', '/attack', <AttackListPage client={client} />);

    expect(screen.getByText('Loading attack targets')).toBeTruthy();
    expect(await screen.findByText(attackListErrorTitle)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Enemy')).toBeTruthy();
    expect(fetchAllPlayers).toHaveBeenCalledTimes(2);
  });

  it('shows a distinct not-found state when an attack target is missing', async () => {
    const client = createClient({
      players: {
        fetchByID: jest
          .fn()
          .mockRejectedValue({ errors: ['player.fetchByID.notFound'] }),
      } as DarkThroneClient['players'],
    });

    renderRoute(
      '/player/player-target',
      '/player/:playerID',
      <AttackViewPlayerPage client={client} />,
    );

    expect(await screen.findByText('Player not found')).toBeTruthy();
    expect(screen.queryByText(playerLoadErrorTitle)).toBeNull();
  });

  it('shows an in-page error when the attack target request fails generically', async () => {
    const client = createClient({
      players: {
        fetchByID: jest.fn().mockRejectedValue(new Error('server.error')),
      } as DarkThroneClient['players'],
    });

    renderRoute(
      '/player/player-target',
      '/player/:playerID',
      <AttackViewPlayerPage client={client} />,
    );

    expect(await screen.findByText(playerLoadErrorTitle)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('shows loading and then an in-page error when war history fails to load', async () => {
    const client = createClient({
      warHistory: {
        fetchAll: jest.fn().mockRejectedValue(new Error('server.error')),
      } as DarkThroneClient['warHistory'],
    });

    renderRoute(
      '/war-history',
      '/war-history',
      <ListWarHistory client={client} />,
    );

    expect(screen.getByText('Loading war history')).toBeTruthy();
    expect(await screen.findByText(warHistoryListErrorTitle)).toBeTruthy();
  });

  it('shows a distinct not-found state when a battle report references a missing player', async () => {
    const fetchByID = jest
      .fn()
      .mockResolvedValueOnce(authenticatedPlayer)
      .mockRejectedValueOnce({ errors: ['player.fetchByID.notFound'] });

    const client = createClient({
      players: {
        fetchByID,
      } as DarkThroneClient['players'],
      warHistory: {
        fetchByID: jest.fn().mockResolvedValue(warHistory),
      } as DarkThroneClient['warHistory'],
    });

    renderRoute(
      '/war-history/history-1',
      '/war-history/:historyID',
      <WarHistoryView client={client} />,
    );

    expect(
      await screen.findByText(
        'This battle report references a player that could not be found.',
      ),
    ).toBeTruthy();
    expect(screen.queryByText(warHistoryErrorTitle)).toBeNull();
  });

  it('shows an in-page error when the battle report request fails generically', async () => {
    const client = createClient({
      warHistory: {
        fetchByID: jest.fn().mockRejectedValue(new Error('server.error')),
      } as DarkThroneClient['warHistory'],
    });

    renderRoute(
      '/war-history/history-1',
      '/war-history/:historyID',
      <WarHistoryView client={client} />,
    );

    expect(await screen.findByText(warHistoryErrorTitle)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });
});
