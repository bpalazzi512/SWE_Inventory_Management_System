import React from 'react';
import { render, screen } from '@testing-library/react';
import ConditionalLayout from '../src/components/ui/conditional-layout';

describe('UI/ConditionalLayout', () => {
  it('renders children and applies layout classes', () => {
    render(
      <ConditionalLayout>
        <div>child-content</div>
      </ConditionalLayout> as any
    );
    expect(screen.getByText(/child-content/i)).toBeInTheDocument();
    // Ensure the main element is present and has the expected layout class
    const main = screen.getByText(/child-content/i).closest('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex');
  });
});
