import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { InsightsOverviewPage } from '../pages/InsightsOverviewPage';

const useCountryInsightsMock = vi.fn();
const useInsightsOverviewMock = vi.fn();

vi.mock('../hooks/useEmployees', () => ({
  useCountryInsights: (filters = {}) => useCountryInsightsMock(filters),
  useInsightsOverview: (filters = {}) => useInsightsOverviewMock(filters),
}));

describe('InsightsOverviewPage', () => {
  it('renders overview metrics and country filters', () => {
    useCountryInsightsMock.mockReturnValue({
      data: {
        countries: [
          { country: 'India', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
          { country: 'United States', headcount: 1, average_salary: 140000, minimum_salary: 140000, maximum_salary: 140000 },
        ],
      },
    });
    useInsightsOverviewMock.mockImplementation((filters = {}) => {
      if (filters.country === 'India') {
        return {
          data: {
            overview: {
              headcount: 2,
              average_salary: 90000,
              minimum_salary: 80000,
              maximum_salary: 100000,
              top_country: 'India',
              employment_type_breakdown: { full_time: 2 },
            },
          },
        };
      }

      return {
        data: {
          overview: {
            headcount: 3,
            average_salary: 106666.67,
            minimum_salary: 80000,
            maximum_salary: 140000,
            top_country: 'India',
            employment_type_breakdown: { full_time: 3 },
          },
        },
      };
    });

    render(<InsightsOverviewPage />);

    expect(screen.getByText('Salary overview')).toBeTruthy();
    expect(screen.getByText('Headcount')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'India' } });

    expect(screen.getByText(/Showing metrics for India/i)).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });
});
