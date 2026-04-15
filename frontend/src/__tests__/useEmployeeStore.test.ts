import { describe, expect, beforeEach, it } from 'vitest';
import { useEmployeeStore } from '../stores/useEmployeeStore';
import type { Employee } from '../api/types';

describe('useEmployeeStore', () => {
  beforeEach(() => {
    useEmployeeStore.setState({
      filters: { q: '', country: '', job_title: '' },
      isFormOpen: false,
      selectedEmployee: null,
    });
  });

  it('opens the form with a selected employee', () => {
    const employee = { id: 1, full_name: 'Maya Chen' } as Employee;

    useEmployeeStore.getState().openForm(employee);

    expect(useEmployeeStore.getState().isFormOpen).toBe(true);
    expect(useEmployeeStore.getState().selectedEmployee).toBe(employee);
  });

  it('merges filters and clears the selection', () => {
    useEmployeeStore.getState().setFilters({ country: 'Singapore' });
    useEmployeeStore.getState().clearSelection();

    expect(useEmployeeStore.getState().filters).toEqual({ q: '', country: 'Singapore', job_title: '' });
    expect(useEmployeeStore.getState().selectedEmployee).toBeNull();
  });
});
