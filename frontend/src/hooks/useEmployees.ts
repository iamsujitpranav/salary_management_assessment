import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployee,
  deleteEmployee,
  fetchCountryInsights,
  fetchEmployee,
  fetchEmployees,
  fetchInsights,
  fetchInsightsOverview,
  fetchJobTitleInsights,
  updateEmployee,
} from '../api/employees';
import type { InsightFilters } from '../api/employees';
import type { EmployeeFormValues } from '../api/types';

type EmployeeQueryParams = Record<string, string | number | undefined>;

const employeeKeys = {
  all: ['employees'] as const,
  list: (filters: EmployeeQueryParams) => ['employees', filters] as const,
};

export function useEmployees(filters: EmployeeQueryParams) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => fetchEmployees(filters),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id] as const,
    queryFn: () => fetchEmployee(id),
    enabled: Number.isFinite(id),
  });
}

export function useInsights(filters: InsightFilters = {}) {
  return useQuery({
    queryKey: ['insights', filters.country ?? 'all', filters.job_title ?? 'all'],
    queryFn: () => fetchInsights(filters),
  });
}

export function useInsightsOverview(filters: Pick<InsightFilters, 'country'> = {}) {
  return useQuery({
    queryKey: ['insights-overview', filters.country ?? 'all'],
    queryFn: () => fetchInsightsOverview(filters),
  });
}

export function useCountryInsights(filters: Pick<InsightFilters, 'country' | 'job_title'> = {}) {
  return useQuery({
    queryKey: ['insights-country', filters.country ?? 'all', filters.job_title ?? 'all'],
    queryFn: () => fetchCountryInsights(filters),
  });
}

export function useJobTitleInsights(filters: InsightFilters = {}) {
  return useQuery({
    queryKey: ['insights-job-title', filters.country ?? 'all', filters.job_title ?? 'all'],
    queryFn: () => fetchJobTitleInsights(filters),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<EmployeeFormValues> }) => updateEmployee(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['insights'] });
      await queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
