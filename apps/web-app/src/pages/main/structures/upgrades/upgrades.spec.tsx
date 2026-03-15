import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { AuthedPlayerObject } from '@darkthrone/interfaces';
import UpgradesScreen from './upgrades';

function createAuthenticatedPlayer(
  overrides: Partial<AuthedPlayerObject> = {},
): AuthedPlayerObject {
  return {
    id: 'player-1',
    name: 'Test Player',
    race: 'human',
    class: 'fighter',
    gold: 500000,
    level: 10,
    overallRank: 1,
    armySize: 10,
    attackStrength: 10,
    defenceStrength: 10,
    experience: 1000,
    attackTurns: 10,
    goldInBank: 0,
    citizensPerDay: 25,
    depositHistory: [],
    units: [{ unitType: 'citizen', quantity: 5 }],
    items: [],
    structureUpgrades: {
      fortification: 0,
      housing: 0,
      armoury: 0,
    },
    goldPerTurn: 100,
    ...overrides,
  };
}

describe('UpgradesScreen', () => {
  it('renders the API validation error inline for the requested upgrade', async () => {
    const upgrade = jest.fn().mockRejectedValue({
      errors: ['structure.upgrade.notEnoughGold'],
    });
    const client = {
      authenticatedPlayer: createAuthenticatedPlayer({
        gold: 500000,
        level: 20,
      }),
      structures: {
        upgrade,
      },
    };

    render(<UpgradesScreen client={client as never} />);

    fireEvent.click(screen.getAllByRole('button')[0]);

    await waitFor(() => {
      expect(upgrade).toHaveBeenCalledWith('fortification');
    });
    expect(
      screen.getByText('You do not have enough gold for this upgrade.'),
    ).toBeTruthy();
  });
});
