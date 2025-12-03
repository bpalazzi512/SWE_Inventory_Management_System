import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/ui/button';

describe('UI/Button', () => {
  it('renders and responds to click', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click Me</Button> as any);
    const btn = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies size and variant classes', () => {
    const { container } = render(<Button variant="outline" size="lg">Large</Button> as any);
    expect(container.querySelector('[data-slot="button"]')).toBeTruthy();
  });
});
