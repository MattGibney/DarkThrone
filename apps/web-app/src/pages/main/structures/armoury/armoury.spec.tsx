import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { unitItems } from '@darkthrone/game-data';
import type { AuthedPlayerObject } from '@darkthrone/interfaces';
import ArmouryScreen from './armoury';

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
    items: [{ itemKey: unitItems[0].key, quantity: 1 }],
    structureUpgrades: {
      fortification: 10,
      housing: 1,
      armoury: 10,
    },
    goldPerTurn: 100,
    ...overrides,
  };
}

describe('ArmouryScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows an inline error when selling more items than the player owns', () => {
    const client = {
      authenticatedPlayer: createAuthenticatedPlayer(),
      armoury: {
        buy: jest.fn(),
        sell: jest.fn(),
      },
    };

    render(<ArmouryScreen client={client as never} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '2' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Sell' })[0]);

    expect(client.armoury.sell).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'You do not own enough of one or more selected items to sell that quantity.',
      ),
    ).toBeTruthy();
  });

  it('renders API validation errors returned during buying', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    const buy = jest.fn().mockRejectedValue({
      errors: ['armoury.buy.insufficientGold'],
    });
    const client = {
      authenticatedPlayer: createAuthenticatedPlayer(),
      armoury: {
        buy,
        sell: jest.fn(),
      },
    };

    render(<ArmouryScreen client={client as never} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '1' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Buy' })[0]);

    await waitFor(() => {
      expect(buy).toHaveBeenCalled();
    });
    expect(
      screen.getByText('You do not have enough gold to buy those items.'),
    ).toBeTruthy();
  });
});
