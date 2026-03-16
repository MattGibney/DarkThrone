import { render, screen } from '@testing-library/react';
import Footer from './footer';

jest.mock('../../environments/environment', () => ({
  __esModule: true,
  default: {
    gameAPI: 'http://localhost:3000',
    releaseTag: 'v1.2.3',
  },
}));

describe('Footer', () => {
  it('renders the deployed release tag when it is available', () => {
    render(<Footer />);

    expect(screen.getByText('Release v1.2.3')).toBeTruthy();
  });
});
