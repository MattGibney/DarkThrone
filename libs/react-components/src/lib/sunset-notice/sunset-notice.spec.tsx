import { render, screen } from '@testing-library/react';
import { SunsetNotice } from './sunset-notice';

describe('SunsetNotice', () => {
  it('explains the shutdown and links to both community destinations', () => {
    render(<SunsetNotice />);

    expect(
      screen.getByRole('heading', {
        name: 'DarkThrone Reborn will close on 1 October 2026',
      }),
    ).toBeTruthy();
    expect(screen.getByText(/New registrations are closed/)).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: /continue the project on GitHub/i })
        .getAttribute('href'),
    ).toBe('https://github.com/MattGibney/DarkThrone');
    expect(
      screen
        .getByRole('link', { name: 'DarkThrone Game' })
        .getAttribute('href'),
    ).toBe('https://darkthronegame.com/');
  });
});
