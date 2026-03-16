import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/environments/environment', () => ({
  environment: {
    webAppUrl: 'http://localhost:4200',
    releaseTag: 'v1.2.3',
  },
}));

import Footer from '../src/components/layout/footer';

describe('Footer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the deployed release tag when it is available', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText('Release v1.2.3')).toBeTruthy();
  });
});
