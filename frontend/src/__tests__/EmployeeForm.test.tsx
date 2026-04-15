import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeForm } from '../components/employees/EmployeeForm';

const onSubmit = vi.fn().mockResolvedValue(undefined);
const onClose = vi.fn();

describe('EmployeeForm', () => {
  it('submits the employee form', async () => {
    render(<EmployeeForm open employee={null} onClose={onClose} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/First name/i), 'Maya');
    await userEvent.type(screen.getByLabelText(/Last name/i), 'Chen');
    await userEvent.type(screen.getByLabelText(/Job title/i), 'Designer');
    await userEvent.type(screen.getByLabelText(/Department/i), 'Design');
    await userEvent.type(screen.getByLabelText(/Country/i), 'Singapore');
    await userEvent.type(screen.getByLabelText(/Email/i), 'maya@example.com');
    await userEvent.type(screen.getByLabelText(/Salary/i), '95000');
    await userEvent.type(screen.getByLabelText(/Currency/i), 'SGD');
    await userEvent.type(screen.getByLabelText(/Employment type/i), 'full_time');
    await userEvent.type(screen.getByLabelText(/Hired on/i), '2024-01-10');
    await userEvent.type(screen.getByLabelText(/Status/i), 'active');

    await userEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(onSubmit).toHaveBeenCalled();
  });
});
