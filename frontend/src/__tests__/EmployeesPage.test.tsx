import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { EmployeesPage } from '../pages/EmployeesPage';

const useEmployeesMock = vi.fn();
const useInsightsMock = vi.fn();
const useCreateEmployeeMock = vi.fn();
const useUpdateEmployeeMock = vi.fn();
const useDeleteEmployeeMock = vi.fn();
const navigateToMock = vi.fn();

vi.mock('../hooks/useEmployees', () => ({
  useEmployees: (filters = {}) => useEmployeesMock(filters),
  useInsights: () => useInsightsMock(),
  useCreateEmployee: () => useCreateEmployeeMock(),
  useUpdateEmployee: () => useUpdateEmployeeMock(),
  useDeleteEmployee: () => useDeleteEmployeeMock(),
}));

vi.mock('../lib/navigation', () => ({
  APP_PATHS: { insightsOverview: '/insights/overview' },
  employeeDetailPath: (id: number) => `/employees/${id}`,
  navigateTo: (path: string) => navigateToMock(path),
}));

vi.mock('../components/employees/EmployeeTable', () => ({
  EmployeeTable: () => <div>employee table</div>,
}));

vi.mock('../components/employees/EmployeeForm', () => ({
  EmployeeForm: () => <div>employee form</div>,
}));

describe('EmployeesPage', () => {
  // Root-page search test: validates that all three filter inputs (q, country, job_title)
  // are correctly forwarded to the employee query hook for backend filtering.
  it('forwards all search filters to the employee query', () => {
    useEmployeesMock.mockReturnValue({
      data: { employees: [], meta: { page: 1, per_page: 10000, total_count: 0, total_pages: 0 } },
      isLoading: false,
    });
    useInsightsMock.mockReturnValue({
      data: {
        overview: {
          headcount: 0,
          average_salary: 0,
          minimum_salary: 0,
          maximum_salary: 0,
          top_country: null,
          employment_type_breakdown: {},
        },
        countries: [],
        job_titles: [],
      },
    });
    useCreateEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });
    useUpdateEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });
    useDeleteEmployeeMock.mockReturnValue({ mutate: vi.fn() });

    render(<EmployeesPage />);

    fireEvent.change(screen.getByPlaceholderText(/Search name, title, department/i), { target: { value: 'maya' } });
    fireEvent.change(screen.getByPlaceholderText(/Job title/i), { target: { value: 'Designer' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Singapore' } });

    expect(useEmployeesMock).toHaveBeenCalledWith({ q: 'maya', job_title: 'Designer', country: 'Singapore', per_page: 10000 });
  });
});
