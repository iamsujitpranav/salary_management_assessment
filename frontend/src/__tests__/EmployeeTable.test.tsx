import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import type { Employee } from '../api/types';

const virtualItems = [{ index: 0, start: 0 }];

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getTotalSize: () => 72,
    getVirtualItems: () => virtualItems,
  }),
}));

const employee: Employee = {
  id: 1,
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

describe('EmployeeTable', () => {
  it('renders loading and empty states', () => {
    const { rerender } = render(
      <EmployeeTable data={[]} isLoading={true} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText(/Loading employees/i)).toBeInTheDocument();

    rerender(<EmployeeTable data={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/No employees found/i)).toBeInTheDocument();
  });

  it('renders employee rows and action buttons', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<EmployeeTable data={[employee]} isLoading={false} onView={onView} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Singapore')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /View/i }));
    await user.click(screen.getByRole('button', { name: /Edit/i }));
    await user.click(screen.getByRole('button', { name: /Delete/i }));

    expect(onView).toHaveBeenCalledWith(employee);
    expect(onEdit).toHaveBeenCalledWith(employee);
    expect(onDelete).toHaveBeenCalledWith(employee);
  });
});
