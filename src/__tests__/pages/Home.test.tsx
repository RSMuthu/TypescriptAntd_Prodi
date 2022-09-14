import Home from '@pages/Home';
import { render, screen } from '@testing-library/react';

test('Home page', () => {
  render(<Home />);
  const textMatch = screen.getByText(/welcome/i);
  expect(textMatch).toBeInTheDocument();
});
