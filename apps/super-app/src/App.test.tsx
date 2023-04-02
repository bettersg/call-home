import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('it should render support cards on /', () => {
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
