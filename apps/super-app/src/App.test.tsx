import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders a nonsense homepage', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const todoLink = screen.getByText(/TODO/i);
  expect(todoLink).toBeInTheDocument();
});

test('renders some nonsense buttons on /scratch', () => {
  render(
    <MemoryRouter initialEntries={['/scratch']}>
      <App />
    </MemoryRouter>
  );

  const primaryButton = screen.getByText(/Primary/i);
  expect(primaryButton).toBeInTheDocument();
  const neutralButton = screen.getByText(/Neutral/i);
  expect(neutralButton).toBeInTheDocument();
  const errorButton = screen.getByText(/Error/i);
  expect(errorButton).toBeInTheDocument();
});
