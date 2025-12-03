import React from 'react';
import { render } from '@testing-library/react';
import OldDashboardPage from '../src/components/old/dashboard/page';

describe('Old Dashboard Page', () => {
  it('renders legacy dashboard page', () => {
    const { container } = render(<OldDashboardPage /> as any);
    expect(container).toBeTruthy();
  });
});
