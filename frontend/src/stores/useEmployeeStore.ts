import { create } from 'zustand';
import type { Employee } from '../api/types';

type Filters = {
  q: string;
  country: string;
  job_title: string;
};

type EmployeeStore = {
  filters: Filters;
  isFormOpen: boolean;
  selectedEmployee: Employee | null;
  openForm: (employee?: Employee | null) => void;
  closeForm: () => void;
  setFilters: (partial: Partial<Filters>) => void;
  clearSelection: () => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  filters: { q: '', country: '', job_title: '' },
  isFormOpen: false,
  selectedEmployee: null,
  openForm: (employee = null) => set({ isFormOpen: true, selectedEmployee: employee }),
  closeForm: () => set({ isFormOpen: false }),
  setFilters: (partial) => set((state) => ({ filters: { ...state.filters, ...partial } })),
  clearSelection: () => set({ selectedEmployee: null }),
}));
