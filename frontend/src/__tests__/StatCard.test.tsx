import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../components/insights/StatCard';

describe('StatCard', () => {
  it('renders a numeric value', () => {
    render(<StatCard label="Headcount" value={10000} accent="violet" />);

    expect(screen.getByText(/10,000/)).toBeInTheDocument();
  });
});
