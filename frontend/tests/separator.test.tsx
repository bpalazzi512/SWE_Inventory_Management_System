import React from 'react';
import { render } from '@testing-library/react';
import { Separator } from '../src/components/ui/separator';

describe('UI/Separator', () => {
  it('renders separator element', () => {
    const { container } = render(<Separator /> as any);
    expect(container.querySelector('hr') || container.firstChild).toBeTruthy();
  });
});
