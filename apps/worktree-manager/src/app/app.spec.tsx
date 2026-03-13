import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import App from './app';

type MockFetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

const mockJsonResponse = (body: unknown): MockFetchResponse => ({
  ok: true,
  status: 200,
  json: async () => body,
});

describe('WorktreeManagerApp', () => {
  it('renders worktree data and summary counts from the manager payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockJsonResponse({
        worktrees: [
          {
            id: 'alpha',
            branch: 'feature/testing',
            status: 'up',
            urls: {
              web: 'http://alpha.darkthrone.test:8080',
              api: 'http://api.alpha.darkthrone.test:8080',
            },
            database: {
              postgres: 'postgresql://darkthrone@localhost:5433/darkthrone',
            },
            ports: {
              api: 3100,
              web: 3200,
              postgres: 5433,
            },
            services: {
              docker: 'up',
              apps: 'up',
            },
          },
          {
            id: 'beta',
            status: 'partial',
            services: {
              docker: 'up',
              apps: 'partial',
            },
          },
        ],
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'alpha' })).toBeTruthy();
    expect(screen.getByText('feature/testing')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Game' }).getAttribute('href'),
    ).toBe('http://alpha.darkthrone.test:8080');
    expect(screen.getByRole('link', { name: 'API' }).getAttribute('href')).toBe(
      'http://api.alpha.darkthrone.test:8080',
    );
    expect(
      screen.getByText('postgresql://darkthrone@localhost:5433/darkthrone'),
    ).toBeTruthy();
    expect(screen.getAllByText('docker: up')).toHaveLength(2);
    expect(screen.getByText('apps: partial')).toBeTruthy();
    expect(screen.getByText('API: 3100')).toBeTruthy();

    await waitFor(() => {
      expect(
        screen.getByText('Worktrees').parentElement?.textContent,
      ).toContain('2');
      expect(screen.getByText('Running').parentElement?.textContent).toContain(
        '1',
      );
      expect(screen.getByText('Partial').parentElement?.textContent).toContain(
        '1',
      );
    });
  });

  it('shows the empty state when the manager returns no environments', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockJsonResponse([]));

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findByText(/No environments detected\./)).toBeTruthy();
    expect(screen.getByText('./tools/dev up [work-id]')).toBeTruthy();
  });

  it('shows an error message when the manager response is unsuccessful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(
      await screen.findByText(/Could not load worktree data \(HTTP 503\)/),
    ).toBeTruthy();
  });
});
