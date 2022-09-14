import App from '@pages/base/App';
import { render, screen } from '@testing-library/react';

test('base app', () => {
  render(<App />);
  const textMatch = screen.getByText(/MYFirm/i);
  expect(textMatch).toBeInTheDocument();
});
