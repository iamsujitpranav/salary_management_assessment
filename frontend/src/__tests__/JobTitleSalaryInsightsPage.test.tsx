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
          { country: 'India', headcount: 2, average_salary: 90000, minimum_salary: 80000, maximum_salary: 100000 },
          { country: 'United States', headcount: 1, average_salary: 140000, minimum_salary: 140000, maximum_salary: 140000 },
        ],
      },
    });
    useJobTitleInsightsMock.mockImplementation((filters = {}) => {
      if (filters.country === 'India' && filters.job_title === 'Engineer') {
        return {
          data: {
            job_titles: [
              { job_title: 'Engineer', headcount: 1, average_salary: 120000 },
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

    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'India' } });
    fireEvent.change(screen.getByPlaceholderText(/Type a job title/i), { target: { value: 'Engineer' } });

    expect(screen.getByText(/Showing metrics for India/i)).toBeTruthy();
    expect(screen.getByText('Engineer')).toBeTruthy();
    expect(screen.getByText('$120,000')).toBeTruthy();
    expect(screen.getByText('120,000')).toBeTruthy();
  });
});
