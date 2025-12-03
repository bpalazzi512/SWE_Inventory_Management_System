import React from 'react';
import { render, screen } from '@testing-library/react';
import RootPage from '../src/app/page';

describe('App Root Page', () => {
  it('renders root page with sign in and create account links', () => {
    render(<RootPage /> as any);
    expect(screen.getByText(/welcome to restocked/i)).toBeInTheDocument();
    const signIn = screen.getByRole('link', { name: /sign in/i });
    const create = screen.getByRole('link', { name: /create account/i });
    expect(signIn).toHaveAttribute('href', '/login');
    expect(create).toHaveAttribute('href', '/register');
  });
});
