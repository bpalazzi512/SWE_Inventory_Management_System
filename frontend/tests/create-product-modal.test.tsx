import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProductModal from '../src/components/products/create-product-modal';

const categories = [
  { id: 'c1', name: 'Cat A' },
  { id: 'c2', name: 'Cat B' },
];
const locations = ['Boston', 'Seattle'];

describe('Products/CreateProductModal', () => {
  it('opens modal, validates price and calls onCreateProduct', async () => {
    const onCreateProduct = jest.fn().mockResolvedValue(undefined);
    const onCreated = jest.fn();

    render(
      <CreateProductModal categories={categories} locations={locations} onCreateProduct={onCreateProduct} onCreated={onCreated} /> as any
    );

    const trigger = screen.getByRole('button', { name: /create product/i });
    await userEvent.click(trigger);

    const name = await screen.findByLabelText(/product name/i);
    const category = screen.getByLabelText(/category/i);
    const location = screen.getByLabelText(/location/i);
    const unitPrice = screen.getByLabelText(/unit price/i);

    await userEvent.type(name, 'Widget');

    // open category select and choose first option
    await userEvent.click(category);
    await userEvent.click(screen.getByText('Cat A'));

    // open location select and choose
    await userEvent.click(location);
    await userEvent.click(screen.getByText('Boston'));

    // invalid price
    await userEvent.type(unitPrice, '-5');
    const createBtn = screen.getByRole('button', { name: /create/i });
    await userEvent.click(createBtn);

    expect(await screen.findByText(/unit price must be a non-negative number/i)).toBeInTheDocument();

    // fix price and submit
    await userEvent.clear(unitPrice);
    await userEvent.type(unitPrice, '12.5');
    await userEvent.click(createBtn);

    await waitFor(() => expect(onCreateProduct).toHaveBeenCalledTimes(1));
    // Allow extra properties (component may pass additional metadata); assert the important fields only
    expect(onCreateProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Widget',
        categoryId: 'c1',
        location: 'Boston',
        price: 12.5,
      })
    );

    await waitFor(() => expect(onCreated).toHaveBeenCalled());
  });
});
