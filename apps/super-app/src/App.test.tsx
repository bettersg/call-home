import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders some nonsense buttons', () => {
  render(<App />);
  const primaryButton = screen.getByText(/Primary/i);
  expect(primaryButton).toBeInTheDocument();
  const neutralButton = screen.getByText(/Neutral/i);
  expect(neutralButton).toBeInTheDocument();
  const errorButton = screen.getByText(/Error/i);
  expect(errorButton).toBeInTheDocument();
});
