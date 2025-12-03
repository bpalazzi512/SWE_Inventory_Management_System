import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock api to avoid network call in useEffect
jest.mock('../src/lib/api', () => ({
  api: { get: jest.fn().mockResolvedValue({ firstName: 'Test' }) },
}));

// Override next/navigation hooks for this test so sidebar renders
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

import Sidebar from '../src/components/ui/sidebar';

describe('UI/Sidebar', () => {
  it('renders navigation links when on protected route', async () => {
    render(<Sidebar /> as any);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
