import React from 'react';
import { render } from '@testing-library/react';
import ProductsPage from '../src/app/(protected)/products/page';

describe('Protected Products Page', () => {
  it('renders products page', () => {
    const { container } = render(<ProductsPage /> as any);
    expect(container).toBeTruthy();
  });
});
