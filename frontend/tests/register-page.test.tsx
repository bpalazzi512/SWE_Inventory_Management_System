import React from 'react';
import { render } from '@testing-library/react';
import RegisterPage from '../src/app/register/page';

describe('Register Page', () => {
  it('renders register page', () => {
    const { container } = render(<RegisterPage /> as any);
    expect(container).toBeTruthy();
  });
});
