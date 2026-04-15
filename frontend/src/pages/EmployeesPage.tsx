import { useEffect, useMemo } from 'react';
import { useEmployeeStore } from '../stores/useEmployeeStore';
import { useCreateEmployee, useDeleteEmployee, useEmployees, useInsights, useUpdateEmployee } from '../hooks/useEmployees';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { APP_PATHS, employeeDetailPath, navigateTo } from '../lib/navigation';
import type { EmployeeFormValues, InsightsResponse } from '../api/types';

const SHOW_ALL_EMPLOYEES_PER_PAGE = 10000;

export function EmployeesPage() {
  const { filters, isFormOpen, selectedEmployee, openForm, closeForm, setFilters, clearSelection } = useEmployeeStore();
  const employeesQuery = useEmployees({ ...filters, per_page: SHOW_ALL_EMPLOYEES_PER_PAGE });
  const insightsQuery = useInsights();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get('create') === '1') {
      openForm();
      search.delete('create');
      window.history.replaceState({}, '', `${window.location.pathname}${search.toString() ? `?${search.toString()}` : ''}`);
    }
  }, [openForm]);

  const countryOptions = useMemo<string[]>(() => {
    const countries = (insightsQuery.data?.countries ?? []) as InsightsResponse['countries'];
    return Array.from(new Set(countries.map(({ country }: InsightsResponse['countries'][number]) => country))).sort();
  }, [insightsQuery.data?.countries]);

  const handleSubmit = async (values: EmployeeFormValues) => {
    if (selectedEmployee) {
      await updateEmployee.mutateAsync({ id: selectedEmployee.id, payload: values });
    } else {
      await createEmployee.mutateAsync(values);
    }

    closeForm();
    clearSelection();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Employees</p>
            <h2 className="mt-2 text-3xl font-semibold">Manage the employee roster</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Search, filter, edit, and remove employees. Use the salary insight pages for aggregated salary metrics.
            </p>
            <p className="mt-2 text-sm text-slate-400">To add a new employee, click the Add employee button below.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openForm()}
              className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:opacity-95"
            >
              Add employee
            </button>
            <button
              type="button"
              onClick={() => navigateTo(APP_PATHS.insightsOverview)}
              className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-medium text-cyan-100 transition hover:border-cyan-300"
            >
              Open salary insights
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-panel/95 p-5 shadow-glow backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={filters.q}
            onChange={(event) => setFilters({ q: event.target.value })}
            placeholder="Search name, title, department..."
            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
          <select
            value={filters.country}
            onChange={(event) => setFilters({ country: event.target.value })}
            className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-cyan-400"
          >
            <option value="">All countries</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <input
            value={filters.job_title}
            onChange={(event) => setFilters({ job_title: event.target.value })}
            placeholder="Job title"
            className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

        <EmployeeTable
          data={employeesQuery.data?.employees ?? []}
          isLoading={employeesQuery.isLoading}
          onView={(employee) => navigateTo(employeeDetailPath(employee.id))}
          onEdit={openForm}
          onDelete={(employee) => deleteEmployee.mutate(employee.id)}
        />
      </div>

      <EmployeeForm
        open={isFormOpen}
        employee={selectedEmployee ?? null}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
