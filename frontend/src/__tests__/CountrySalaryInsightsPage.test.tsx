import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CountrySalaryInsightsPage } from '../pages/CountrySalaryInsightsPage';

const useCountryInsightsMock = vi.fn();

vi.mock('../hooks/useEmployees', () => ({
  useCountryInsights: (filters = {}) => useCountryInsightsMock(filters),
}));

describe('CountrySalaryInsightsPage', () => {
  it('filters country salary metrics', () => {
    useCountryInsightsMock.mockImplementation((filters = {}) => {
      if (filters.country === 'India') {
        return {
          data: {
            countries: [
              { country: 'India', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
            ],
          },
        };
      }

      return {
        data: {
          countries: [
            { country: 'India', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
            { country: 'United States', headcount: 1, average_salary: 140000, minimum_salary: 140000, maximum_salary: 140000 },
          ],
        },
      };
    });

    render(<CountrySalaryInsightsPage />);

    expect(screen.getByText('Country salary insights')).toBeTruthy();
    expect(screen.getByText('Countries shown')).toBeTruthy();
    expect(screen.getByText('Country')).toBeTruthy();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'India' } });

    expect(screen.getByText(/Showing metrics for India/i)).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('$90,000')).toBeTruthy();
    expect(screen.getByText('$20,000')).toBeTruthy();
  });
});
