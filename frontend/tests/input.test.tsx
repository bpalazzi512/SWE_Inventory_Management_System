import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/components/ui/input';

describe('UI/Input', () => {
  it('renders an input and allows typing', async () => {
    render(<Input placeholder="test" /> as any);
    const input = screen.getByPlaceholderText('test');
    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'hello');
    expect((input as HTMLInputElement).value).toBe('hello');
  });
});
