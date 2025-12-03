import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InventoryTable } from '../src/components/inventory/inventory-table';

const sample = { name: 'Widget', sku: 'W-001', category: 'Gadgets', quantity: 10, unitPrice: 5 };

describe('Inventory/InventoryTable', () => {
  it('renders inventory and filters by search', async () => {
    render(<InventoryTable inventories={[sample] as any} /> as any);
    expect(screen.getByText(/widget/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/search by name or sku/i);
    await userEvent.type(input, 'nope');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'W-001');
    expect(screen.getByText(/widget/i)).toBeInTheDocument();
  });
});
