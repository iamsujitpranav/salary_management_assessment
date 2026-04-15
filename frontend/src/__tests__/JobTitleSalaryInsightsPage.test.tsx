import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { JobTitleSalaryInsightsPage } from '../pages/JobTitleSalaryInsightsPage';

const useCountryInsightsMock = vi.fn();
const useJobTitleInsightsMock = vi.fn();

vi.mock('../hooks/useEmployees', () => ({
  useCountryInsights: (filters = {}) => useCountryInsightsMock(filters),
  useJobTitleInsights: (filters = {}) => useJobTitleInsightsMock(filters),
}));

describe('JobTitleSalaryInsightsPage', () => {
  it('filters by country and job title', () => {
    useCountryInsightsMock.mockReturnValue({
      data: {
        countries: [
          { country: 'India', job_title: 'Engineer', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
          { country: 'United States', job_title: 'Manager', headcount: 1, average_salary: 140000, minimum_salary: 140000, maximum_salary: 140000 },
        ],
      },
    });
    useJobTitleInsightsMock.mockImplementation((filters = {}) => {
      if (filters.country === 'India' && filters.job_title === 'Engineer') {
        return {
          data: {
            job_titles: [
              { job_title: 'Engineer', country: 'India', headcount: 1, average_salary: 120000 },
            ],
          },
        };
      }

      return {
        data: {
          job_titles: [],
        },
      };
    });

    render(<JobTitleSalaryInsightsPage />);

    expect(screen.getByText('Job title salary insights')).toBeTruthy();
    expect(screen.getByText('Job titles shown')).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search by country/i)).toBeTruthy();

    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'India' } });
    fireEvent.change(screen.getByPlaceholderText(/Type a job title/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByPlaceholderText(/Search by country/i), { target: { value: 'Ind' } });

    expect(screen.getByText('Engineer')).toBeTruthy();
    expect(screen.getAllByText('India').length).toBeGreaterThan(0);
    expect(screen.getByText('$120,000')).toBeTruthy();
    expect(screen.getByText('120,000')).toBeTruthy();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('shows an empty state when the country search matches nothing', () => {
    useCountryInsightsMock.mockReturnValue({
      data: {
        countries: [
          { country: 'India', job_title: 'Engineer', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
        ],
      },
    });
    useJobTitleInsightsMock.mockReturnValue({
      data: {
        job_titles: [
          { job_title: 'Engineer', country: 'India', headcount: 1, average_salary: 120000 },
        ],
      },
    });

    render(<JobTitleSalaryInsightsPage />);

    fireEvent.change(screen.getByPlaceholderText(/Search by country/i), { target: { value: 'Australia' } });

    expect(screen.getByText('No job title metrics available.')).toBeTruthy();
  });
});
