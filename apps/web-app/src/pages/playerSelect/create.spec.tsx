import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type DarkThroneClient from '@darkthrone/client-library';
import type {
  PlayerClass,
  PlayerNameValidation,
  PlayerObject,
  PlayerRace,
} from '@darkthrone/interfaces';

import CreatePlayerPage from './create';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

type MockPlayersClient = {
  validatePlayerName: jest.Mock<Promise<PlayerNameValidation>, [string]>;
  create: jest.Mock<Promise<PlayerObject>, [string, PlayerRace, PlayerClass]>;
};

function makeClient(
  players: MockPlayersClient,
  auth: { assumePlayer: jest.Mock } = { assumePlayer: jest.fn() },
): DarkThroneClient {
  return {
    players,
    auth,
  } as unknown as DarkThroneClient;
}

function fillRequiredSelections() {
  fireEvent.click(screen.getByRole('button', { name: /human/i }));
  fireEvent.click(screen.getByRole('button', { name: /fighter/i }));
}

describe('CreatePlayerPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('disables submit when the player name changes after a successful validation', async () => {
    const players = {
      validatePlayerName: jest.fn().mockResolvedValue({
        isValid: true,
        issues: [],
      }),
      create: jest.fn(),
    };

    render(<CreatePlayerPage client={makeClient(players)} />);

    const playerNameInput = screen.getByLabelText('Player Name');
    const submitButton = screen.getByRole('button', { name: /create player/i });

    fillRequiredSelections();

    fireEvent.change(playerNameInput, { target: { value: 'ValidName' } });
    fireEvent.blur(playerNameInput);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    fireEvent.change(playerNameInput, { target: { value: 'TakenName' } });

    expect(submitButton.disabled).toBe(true);
    expect(players.validatePlayerName).toHaveBeenCalledWith('ValidName');
  });

  it('renders create-player validation failures inline and keeps the user on the form', async () => {
    const players = {
      validatePlayerName: jest.fn().mockResolvedValue({
        isValid: true,
        issues: [],
      }),
      create: jest.fn().mockRejectedValue({
        errors: ['player.name.validation.taken'],
      }),
    };

    render(<CreatePlayerPage client={makeClient(players)} />);

    const playerNameInput = screen.getByLabelText('Player Name');
    const submitButton = screen.getByRole('button', { name: /create player/i });

    fillRequiredSelections();

    fireEvent.change(playerNameInput, { target: { value: 'TakenName' } });
    fireEvent.blur(playerNameInput);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    fireEvent.click(submitButton);

    expect(players.create).toHaveBeenCalledWith(
      'TakenName',
      'human',
      'fighter',
    );

    await waitFor(() => {
      expect(screen.getByText('This name is already taken.')).toBeTruthy();
    });

    expect(submitButton.disabled).toBe(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('assumes the new player and sends them to the overview after creation', async () => {
    const players = {
      validatePlayerName: jest.fn().mockResolvedValue({
        isValid: true,
        issues: [],
      }),
      create: jest.fn().mockResolvedValue({
        id: 'player-1',
      } as PlayerObject),
    };
    const assumePlayer = jest.fn().mockResolvedValue({});

    render(<CreatePlayerPage client={makeClient(players, { assumePlayer })} />);

    const playerNameInput = screen.getByLabelText('Player Name');
    const submitButton = screen.getByRole('button', { name: /create player/i });

    fillRequiredSelections();

    fireEvent.change(playerNameInput, { target: { value: 'FreshStart' } });
    fireEvent.blur(playerNameInput);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(players.create).toHaveBeenCalledWith(
        'FreshStart',
        'human',
        'fighter',
      );
    });
    await waitFor(() => {
      expect(assumePlayer).toHaveBeenCalledWith('player-1');
      expect(mockNavigate).toHaveBeenCalledWith('/overview');
    });
  });
});
