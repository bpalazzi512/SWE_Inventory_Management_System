import React from 'react';
import { render } from '@testing-library/react';
import DashboardPage from '../src/app/(protected)/dashboard/page';

describe('Protected Dashboard Page', () => {
  it('renders protected dashboard page', () => {
    const { container } = render(<DashboardPage /> as any);
    expect(container).toBeTruthy();
  });
});
