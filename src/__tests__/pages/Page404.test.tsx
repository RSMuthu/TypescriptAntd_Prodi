import Page from '@pages/Page404';
import { render, screen } from '@testing-library/react';

test('Page 404', () => {
  render(<Page />);
  const textMatch = screen.getByText(/404/i);
  expect(textMatch).toBeInTheDocument();
});
