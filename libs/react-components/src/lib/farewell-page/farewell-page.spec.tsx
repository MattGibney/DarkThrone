import { render, screen, within } from '@testing-library/react';
import { FarewellPage } from './farewell-page';

describe('FarewellPage', () => {
  it('thanks players and points them to both community destinations', () => {
    render(<FarewellPage />);

    expect(
      screen.getByRole('heading', { name: 'Thank you for playing' }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: /Continue at DarkThrone Game/i })
        .getAttribute('href'),
    ).toBe('https://darkthronegame.com/');
    expect(
      screen
        .getByRole('link', { name: /Explore the source on GitHub/i })
        .getAttribute('href'),
    ).toBe('https://github.com/MattGibney/DarkThrone');
  });

  it('shows the verified lifetime statistics and official top ten', () => {
    render(<FarewellPage />);

    expect(screen.getByText('1,640')).toBeTruthy();
    expect(screen.getByText('78,615')).toBeTruthy();
    expect(screen.getByText('247.7B')).toBeTruthy();

    const ranking = screen.getByRole('table', {
      name: 'DarkThrone Reborn official final top ten players',
    });
    const rows = within(ranking).getAllByRole('row');

    expect(rows).toHaveLength(11);
    expect(within(rows[1]).getByText('nessuno')).toBeTruthy();
    expect(within(rows[10]).getByText('kinkkinV2')).toBeTruthy();
  });
});
