import Filter from '@pages/CallFilter';
import { render, screen } from '@testing-library/react';

test('Call Filter Page', () => {
  render(<Filter />);
  const textMatch = screen.getByText(/Caller ID/i);
  expect(textMatch).toBeInTheDocument();
});
