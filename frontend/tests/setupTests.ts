import '@testing-library/jest-dom';
import React from 'react';

// Mock next/image to a simple img for tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', { src, alt, ...props });
  },
}));

// Mock next/link to a simple anchor
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children),
}));

// Mock next/navigation hooks used in app components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
}));
