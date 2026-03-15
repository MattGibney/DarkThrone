/** @jest-environment jsdom */

import { render, screen, within } from '@testing-library/react';
import type DarkThroneClient from '@darkthrone/client-library';
import type { DepositHistory } from '@darkthrone/interfaces';
import { TextDecoder, TextEncoder } from 'node:util';
import type { ComponentType } from 'react';
import type { MemoryRouterProps } from 'react-router-dom';

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

let MemoryRouter: ComponentType<MemoryRouterProps>;
let BankHistoryPage: ComponentType<{ client: DarkThroneClient }>;

function createClient(depositHistory: DepositHistory[]) {
  return {
    authenticatedPlayer: {
      depositHistory,
    },
  } as DarkThroneClient;
}

describe('BankHistoryPage', () => {
  beforeAll(async () => {
    ({ MemoryRouter } = await import('react-router-dom'));
    ({ default: BankHistoryPage } = await import('./history'));
  });

  it('renders a sorted copy without mutating deposit history', () => {
    const depositHistory: DepositHistory[] = [
      {
        amount: 125,
        date: new Date('2026-03-14T09:00:00.000Z'),
        type: 'deposit',
      },
      {
        amount: 25,
        date: new Date('2026-03-12T09:00:00.000Z'),
        type: 'withdraw',
      },
      {
        amount: 500,
        date: new Date('2026-03-15T09:00:00.000Z'),
        type: 'deposit',
      },
    ];
    const originalOrder = depositHistory.map(({ amount }) => amount);

    render(
      <MemoryRouter initialEntries={['/bank/history']}>
        <BankHistoryPage client={createClient(depositHistory)} />
      </MemoryRouter>,
    );

    const renderedAmounts = screen
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[1]?.textContent?.trim());

    expect(renderedAmounts).toEqual(['500', '125', '25']);
    expect(depositHistory.map(({ amount }) => amount)).toEqual(originalOrder);
  });
});
