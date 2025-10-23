import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/app/components/ui/atoms/Button';
import '@testing-library/jest-dom';

describe('Button', () => {
  it('renders with the correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    fireEvent.click(screen.getByRole('button', { name: /tap/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  /**
   * Assert a stable testing attribute rather than CSS classes.
   */
  it('exposes its variant via data-variant for testing', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveAttribute(
      'data-variant',
      'secondary'
    );
  });
});
