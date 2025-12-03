import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductsTable } from '../src/components/products/products-table';

const sampleProduct = {
  id: 'p1',
  name: 'Widget',
  sku: 'W-001',
  category: 'Gadgets',
  unitPrice: 9.5,
};

describe('Products/ProductsTable', () => {
  it('shows product and supports search filtering', async () => {
    render(<ProductsTable products={[sampleProduct] as any} locations={[]} categories={[]} /> as any);
    expect(screen.getByText(/widget/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/search by name or sku/i);
    await userEvent.type(input, 'nomatch');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'W-001');
    expect(screen.getByText(/widget/i)).toBeInTheDocument();
  });
});
