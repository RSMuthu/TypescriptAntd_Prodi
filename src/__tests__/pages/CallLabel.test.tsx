import Label from '@pages/CallLabel';
import { render, screen } from '@testing-library/react';

test('Call Label Page', () => {
  render(<Label />);
  const textMatch = screen.getByText(/Caller ID/i);
  expect(textMatch).toBeInTheDocument();
});
