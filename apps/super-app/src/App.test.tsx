import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders LandingPage component on load homepage', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const header = screen.getByText('Free Support Services');
  expect(header).toBeInTheDocument();
  const twc2 = screen.getByText('Transient Workers Count Too');
  expect(twc2).toBeInTheDocument();
  const pbsg = screen.getByText('Pro Bono SG');
  expect(pbsg).toBeInTheDocument();
});

test('make sure app initializes on /landing-page', () => {
  render(
    <MemoryRouter initialEntries={['/landing-page']}>
      <App />
    </MemoryRouter>
  );
  const header = screen.getByText('Free Support Services');
  expect(header).toBeInTheDocument();
  const twc2 = screen.getByText('Transient Workers Count Too');
  expect(twc2).toBeInTheDocument();
  const pbsg = screen.getByText('Pro Bono SG');
  expect(pbsg).toBeInTheDocument();
});
