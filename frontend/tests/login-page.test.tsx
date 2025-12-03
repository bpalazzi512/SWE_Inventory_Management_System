import React from 'react';
import { render } from '@testing-library/react';
import LoginPage from '../src/app/login/page';

describe('Login Page', () => {
  it('renders login page', () => {
    const { container } = render(<LoginPage /> as any);
    expect(container).toBeTruthy();
  });
});
