import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App and navigation items properly', () => {
  render(<App />);
  const homeLinks = screen.getAllByText(/Trang Chủ/i);
  expect(homeLinks.length).toBeGreaterThan(0);
});
