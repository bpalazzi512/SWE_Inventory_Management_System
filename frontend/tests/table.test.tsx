import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../src/components/ui/table';

describe('UI/Table', () => {
  it('renders table elements and children', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>H1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table> as any
    );
    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });
});
