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
      if (filters.country === 'India' && filters.job_title === 'des') {
        return {
          data: {
            countries: [
              { country: 'India', job_title: 'Designer', headcount: 1, average_salary: 95000, minimum_salary: 95000, maximum_salary: 95000 },
            ],
          },
        };
      }

      return {
        data: {
          countries: [
            { country: 'India', job_title: 'Designer', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
            { country: 'United States', job_title: 'Manager', headcount: 1, average_salary: 140000, minimum_salary: 140000, maximum_salary: 140000 },
          ],
        },
      };
    });

    render(<CountrySalaryInsightsPage />);

    expect(screen.getByText('Country salary insights')).toBeTruthy();
    expect(screen.getByText('Countries shown')).toBeTruthy();
    expect(screen.getByText('Country')).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search by job title/i)).toBeTruthy();
    expect(screen.getByText('Designer')).toBeTruthy();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'India' } });
    fireEvent.change(screen.getByPlaceholderText(/Search by job title/i), { target: { value: 'des' } });

    expect(useCountryInsightsMock).toHaveBeenCalledWith({ country: 'India', job_title: 'des' });
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$95,000').length).toBeGreaterThan(0);
    expect(screen.getByText('$0')).toBeTruthy();
  });

  it('shows an empty state when no country metrics match the filters', () => {
    useCountryInsightsMock.mockImplementation((filters = {}) => {
      if (filters.country === 'India' && filters.job_title === 'Architect') {
        return { data: { countries: [] } };
      }

      return {
        data: {
          countries: [
            { country: 'India', job_title: 'Designer', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
          ],
        },
      };
    });

    render(<CountrySalaryInsightsPage />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'India' } });
    fireEvent.change(screen.getByPlaceholderText(/Search by job title/i), { target: { value: 'Architect' } });

    expect(screen.getByText('No country metrics available.')).toBeTruthy();
  });
});
