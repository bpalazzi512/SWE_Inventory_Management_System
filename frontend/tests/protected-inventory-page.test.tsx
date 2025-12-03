import React from 'react';
import { render } from '@testing-library/react';
import InventoryPage from '../src/app/(protected)/inventory/page';

describe('Protected Inventory Page', () => {
  it('renders inventory page', () => {
    const { container } = render(<InventoryPage /> as any);
    expect(container).toBeTruthy();
  });
});
