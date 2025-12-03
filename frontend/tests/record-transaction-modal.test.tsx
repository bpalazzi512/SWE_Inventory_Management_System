import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecordTransactionModal from '../src/components/transactions/record-transaction-modal';

describe('Transactions/RecordTransactionModal', () => {
  it('opens modal, validates and submits transaction', async () => {
    const onCreateTransaction = jest.fn().mockResolvedValue(undefined);
    const onCreated = jest.fn();

    render(<RecordTransactionModal onCreateTransaction={onCreateTransaction} onCreated={onCreated} /> as any);

    const trigger = screen.getByRole('button', { name: /record stock in\/out/i });
    await userEvent.click(trigger);

    const sku = await screen.findByLabelText(/sku/i);
    const quantity = screen.getByLabelText(/quantity/i);
    const submit = screen.getByRole('button', { name: /submit/i });

    // Attempt submit with missing sku/quantity
    await userEvent.click(submit);
    // Should not call the callback because the form is incomplete
    expect(onCreateTransaction).toHaveBeenCalledTimes(0);

    // Fill and submit
    await userEvent.type(sku, 'W-001');
    await userEvent.type(quantity, '3');
    await userEvent.click(submit);

    await waitFor(() => expect(onCreateTransaction).toHaveBeenCalledTimes(1));
    expect(onCreateTransaction).toHaveBeenCalledWith({ sku: 'W-001', type: 'IN', quantity: 3, description: undefined });
    await waitFor(() => expect(onCreated).toHaveBeenCalled());
  });

  it('shows error when no onCreateTransaction provided', async () => {
    render(<RecordTransactionModal /> as any);
    const trigger = screen.getByRole('button', { name: /record stock in\/out/i });
    await userEvent.click(trigger);

    const sku = await screen.findByLabelText(/sku/i);
    const quantity = screen.getByLabelText(/quantity/i);
    const submit = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(sku, 'X');
    await userEvent.type(quantity, '1');
    await userEvent.click(submit);

    expect(await screen.findByText(/transaction creation function not provided/i)).toBeInTheDocument();
  });
});
