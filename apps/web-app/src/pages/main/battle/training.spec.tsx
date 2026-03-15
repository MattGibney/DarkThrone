import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { AuthedPlayerObject } from '@darkthrone/interfaces';
import TrainingScreen from './training';

function createAuthenticatedPlayer(
  overrides: Partial<AuthedPlayerObject> = {},
): AuthedPlayerObject {
  return {
    id: 'player-1',
    name: 'Test Player',
    race: 'human',
    class: 'fighter',
    gold: 5000,
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
    units: [
      { unitType: 'citizen', quantity: 2 },
      { unitType: 'worker', quantity: 1 },
      { unitType: 'soldier_1', quantity: 1 },
      { unitType: 'guard_1', quantity: 1 },
    ],
    items: [],
    structureUpgrades: {
      fortification: 1,
      housing: 1,
      armoury: 1,
    },
    goldPerTurn: 100,
    ...overrides,
  };
}

describe('TrainingScreen', () => {
  it('shows an inline error when training exceeds available citizens', () => {
    const trainUnits = jest.fn();
    const client = {
      authenticatedPlayer: createAuthenticatedPlayer(),
      training: {
        trainUnits,
        unTrainUnits: jest.fn(),
      },
    };

    render(<TrainingScreen client={client as never} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Train' }));

    expect(trainUnits).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        'You do not have enough citizens available to train that many units.',
      ),
    ).toBeTruthy();
  });

  it('renders API validation errors returned during un-training', async () => {
    const unTrainUnits = jest.fn().mockRejectedValue({
      errors: ['training.untrain.notEnoughUnitsTrained'],
    });
    const client = {
      authenticatedPlayer: createAuthenticatedPlayer({
        gold: 10000,
      }),
      training: {
        trainUnits: jest.fn(),
        unTrainUnits,
      },
    };

    render(<TrainingScreen client={client as never} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Un-Train' }));

    await waitFor(() => {
      expect(unTrainUnits).toHaveBeenCalled();
    });
    expect(
      screen.getByText(
        'You do not own enough of one or more selected unit types to un-train that quantity.',
      ),
    ).toBeTruthy();
  });
});
