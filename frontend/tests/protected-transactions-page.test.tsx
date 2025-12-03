import React from 'react';
import { render } from '@testing-library/react';
import TransactionsPage from '../src/app/(protected)/transactions/page';

describe('Protected Transactions Page', () => {
  it('renders transactions page', () => {
    const { container } = render(<TransactionsPage /> as any);
    expect(container).toBeTruthy();
  });
});
