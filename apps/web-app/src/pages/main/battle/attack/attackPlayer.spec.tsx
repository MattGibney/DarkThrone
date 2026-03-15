import { fireEvent, render, screen } from '@testing-library/react';
import type DarkThroneClient from '@darkthrone/client-library';
import type {
  AuthedPlayerObject,
  PlayerObject,
  WarHistoryObject,
} from '@darkthrone/interfaces';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import AttackPlayerPage from './attackPlayer';

const targetPlayer: PlayerObject = {
  id: 'PLR-target',
  name: 'Target Player',
  race: 'elf',
  class: 'cleric',
  gold: 500,
  level: 12,
  overallRank: 3,
  armySize: 20,
};

const authenticatedPlayer: AuthedPlayerObject = {
  id: 'PLR-attacker',
  name: 'Attacker',
  race: 'human',
  class: 'fighter',
  gold: 1000,
  level: 12,
  overallRank: 1,
  armySize: 25,
  attackStrength: 150,
  defenceStrength: 120,
  experience: 200,
  attackTurns: 7,
  goldInBank: 0,
  citizensPerDay: 25,
  depositHistory: [],
  units: [],
  items: [],
  structureUpgrades: {
    fortification: 0,
    housing: 0,
    armoury: 0,
  },
  goldPerTurn: 100,
};

function WarHistoryPage() {
  const { historyID } = useParams<{ historyID: string }>();

  return <div>War history {historyID}</div>;
}

function renderAttackPage(client: DarkThroneClient) {
  render(
    <MemoryRouter initialEntries={['/attack/PLR-target']}>
      <Routes>
        <Route
          path="/attack/:playerID"
          element={<AttackPlayerPage client={client} />}
        />
        <Route path="/war-history/:historyID" element={<WarHistoryPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function buildClient(isAttackerVictor: boolean) {
  const fetchByID = jest.fn().mockResolvedValue(targetPlayer);
  const attackPlayer = jest.fn().mockResolvedValue({
    id: 'WRH-01',
    attackerID: authenticatedPlayer.id,
    defenderID: targetPlayer.id,
    isAttackerVictor,
    attackTurnsUsed: 1,
    attackerStrength: 150,
    defenderStrength: 120,
    goldStolen: isAttackerVictor ? 50 : 0,
    createdAt: new Date(),
  } as WarHistoryObject);
  const emit = jest.fn();

  const client = {
    players: { fetchByID },
    attack: { attackPlayer },
    authenticatedPlayer,
    emit,
  } as unknown as DarkThroneClient;

  return { attackPlayer, client, emit, fetchByID };
}

describe('AttackPlayerPage', () => {
  it.each([
    { isAttackerVictor: true, outcome: 'victory' },
    { isAttackerVictor: false, outcome: 'defeat' },
  ])(
    'emits playerUpdate and navigates after a successful $outcome',
    async ({ isAttackerVictor }) => {
      const { attackPlayer, client, emit, fetchByID } =
        buildClient(isAttackerVictor);

      renderAttackPage(client);

      expect(await screen.findByText(targetPlayer.name)).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'Attack' }));

      expect(await screen.findByText('War history WRH-01')).toBeTruthy();
      expect(fetchByID).toHaveBeenCalledWith(targetPlayer.id);
      expect(attackPlayer).toHaveBeenCalledWith(targetPlayer.id, 1);
      expect(emit).toHaveBeenCalledWith('playerUpdate');
    },
  );
});
