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
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'India' } });

    expect(screen.getByText(/Showing metrics for India/i)).toBeTruthy();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
  });

  it('shows an empty state when there are no employment type metrics', () => {
    useCountryInsightsMock.mockReturnValue({
      data: {
        countries: [],
      },
    });
    useInsightsOverviewMock.mockReturnValue({
      data: {
        overview: {
          headcount: 0,
          average_salary: 0,
          minimum_salary: 0,
          maximum_salary: 0,
          top_country: null,
          employment_type_breakdown: {},
        },
      },
    });

    render(<InsightsOverviewPage />);

    expect(screen.getByText('No employment type metrics available.')).toBeTruthy();
  });
});
