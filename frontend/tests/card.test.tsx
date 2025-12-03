import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardTitle } from '../src/components/ui/card';

describe('UI/Card', () => {
  it('renders Card structure and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    // confirm data-slot attributes are present
    expect(screen.getByText(/title/i).closest('[data-slot="card-title"]')).toBeTruthy();
  });
});
