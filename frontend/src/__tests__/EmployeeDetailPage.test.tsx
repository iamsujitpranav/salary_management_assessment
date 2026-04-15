import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { EmployeeDetailPage } from '../pages/EmployeeDetailPage';

const useEmployeeMock = vi.fn();
const useUpdateEmployeeMock = vi.fn();
const useDeleteEmployeeMock = vi.fn();
const navigateToMock = vi.fn();

vi.mock('../hooks/useEmployees', () => ({
  useEmployee: (id: number) => useEmployeeMock(id),
  useUpdateEmployee: () => useUpdateEmployeeMock(),
  useDeleteEmployee: () => useDeleteEmployeeMock(),
}));

vi.mock('../lib/navigation', () => ({
  APP_PATHS: {
    employees: '/',
  },
  employeeDetailPath: (id: number) => `/employees/${id}`,
  navigateTo: (path: string) => navigateToMock(path),
}));

vi.mock('../components/insights/StatCard', () => ({
  StatCard: ({ label, value }: { label: string; value: string | number }) => (
    <div>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

vi.mock('../components/employees/EmployeeForm', () => ({
  EmployeeForm: ({ open, onClose }: { open: boolean; onClose: () => void }) => (open ? <button type="button" onClick={onClose}>close form</button> : null),
}));

describe('EmployeeDetailPage', () => {
  it('shows a loading state while the employee is being fetched', () => {
    useEmployeeMock.mockReturnValue({ data: null, isLoading: true });
    useUpdateEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });
    useDeleteEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });

    render(<EmployeeDetailPage employeeId={7} />);

    expect(screen.getByText(/Loading employee details/i)).toBeTruthy();
  });

  it('shows a not-found state when the employee does not exist', () => {
    useEmployeeMock.mockReturnValue({ data: null, isLoading: false });
    useUpdateEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });
    useDeleteEmployeeMock.mockReturnValue({ mutateAsync: vi.fn() });

    render(<EmployeeDetailPage employeeId={999} />);

    expect(screen.getByText(/Employee not found/i)).toBeTruthy();
  });

  it('renders the employee record and supports editing and deleting', async () => {
    const employee = {
      id: 7,
      first_name: 'Maya',
      last_name: 'Chen',
      full_name: 'Maya Chen',
      job_title: 'Designer',
      department: 'Design',
      country: 'Singapore',
      email: 'maya@example.com',
      salary: 95000,
      currency: 'SGD',
      employment_type: 'full_time',
      hired_on: '2024-01-10',
      status: 'active',
    };

    useEmployeeMock.mockReturnValue({ data: { employee }, isLoading: false });
    const updateEmployeeMutateAsync = vi.fn().mockResolvedValue(undefined);
    const deleteEmployeeMutateAsync = vi.fn().mockResolvedValue(undefined);
    useUpdateEmployeeMock.mockReturnValue({ mutateAsync: updateEmployeeMutateAsync });
    useDeleteEmployeeMock.mockReturnValue({ mutateAsync: deleteEmployeeMutateAsync });

    render(<EmployeeDetailPage employeeId={7} />);

    expect(screen.getByText('Maya Chen')).toBeTruthy();
    expect(screen.getByText('Employee details')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Edit employee/i }));
    expect(screen.getByRole('button', { name: 'close form' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Delete employee/i }));
    expect(deleteEmployeeMutateAsync).toHaveBeenCalledWith(7);

    fireEvent.click(screen.getByRole('button', { name: /Refresh view/i }));
    expect(navigateToMock).toHaveBeenCalledWith('/employees/7');
  });
});
