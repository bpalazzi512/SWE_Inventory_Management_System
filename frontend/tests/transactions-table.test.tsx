import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionsTable } from '../src/components/transactions/transactions-table';

const sampleTx = {
  tid: 'T-100',
  date: '2025-12-01',
  items: [
    { sku: 'W-001', type: 'IN', quantity: 5, description: 'restock' },
  ],
};

describe('Transactions/TransactionsTable', () => {
  it('renders transaction and filters by search', async () => {
    render(<TransactionsTable transactions={[sampleTx] as any} /> as any);
    expect(screen.getByText(/t-100/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/search by tid or date/i);
    await userEvent.type(input, 'nope');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, '2025-12-01');
    expect(screen.getByText(/t-100/i)).toBeInTheDocument();
  });
});
