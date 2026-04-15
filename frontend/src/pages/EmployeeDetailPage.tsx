import { useMemo, useState } from 'react';
import { StatCard } from '../components/insights/StatCard';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { APP_PATHS, employeeDetailPath, navigateTo } from '../lib/navigation';
import { useDeleteEmployee, useEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import type { EmployeeFormValues } from '../api/types';

type Props = {
  employeeId: number;
};

export function EmployeeDetailPage({ employeeId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const employeeQuery = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const employee = employeeQuery.data?.employee ?? null;

  const detailRows = useMemo(
    () => [
      { label: 'First name', value: employee?.first_name ?? '—' },
      { label: 'Last name', value: employee?.last_name ?? '—' },
      { label: 'Job title', value: employee?.job_title ?? '—' },
      { label: 'Department', value: employee?.department ?? '—' },
      { label: 'Country', value: employee?.country ?? '—' },
      { label: 'Email', value: employee?.email ?? '—' },
      { label: 'Employment type', value: employee?.employment_type ?? '—' },
      { label: 'Hired on', value: employee?.hired_on ?? '—' },
      { label: 'Status', value: employee?.status ?? '—' },
      { label: 'Currency', value: employee?.currency ?? '—' },
    ],
    [employee],
  );

  const handleSubmit = async (values: EmployeeFormValues) => {
    await updateEmployee.mutateAsync({ id: employeeId, payload: values });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteEmployee.mutateAsync(employeeId);
    navigateTo(APP_PATHS.employees);
  };

  if (employeeQuery.isLoading) {
    return <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 text-slate-300">Loading employee details...</div>;
  }

  if (!employee) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <h2 className="text-2xl font-semibold">Employee not found</h2>
        <p className="text-sm text-slate-300">The employee you were looking for does not exist or has been deleted.</p>
        <button type="button" onClick={() => navigateTo(APP_PATHS.employees)} className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-medium text-cyan-100">
          Back to employees
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Employee profile</p>
            <h2 className="mt-2 text-3xl font-semibold">{employee.full_name}</h2>
            <p className="mt-2 text-sm text-slate-300">
              View the employee record, edit it inline, and delete it from a dedicated page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setIsEditing(true)} className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-medium text-slate-950">
              Edit employee
            </button>
            <button type="button" onClick={handleDelete} className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-5 py-3 font-medium text-rose-100">
              Delete employee
            </button>
            <button type="button" onClick={() => navigateTo(employeeDetailPath(employee.id))} className="rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200">
              Refresh view
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Salary" value={employee.salary} accent="cyan" prefix={`${employee.currency} `} />
        <StatCard label="Status" value={employee.status} accent="violet" />
        <StatCard label="Country" value={employee.country} accent="emerald" />
        <StatCard label="Employment type" value={employee.employment_type.replace(/_/g, ' ')} accent="amber" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-panel2/95 p-5 shadow-glow backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Employee details</h3>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {detailRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-800/60 last:border-0">
                  <th className="py-3 pr-4 text-left font-medium text-slate-300">{row.label}</th>
                  <td className="py-3 text-right text-white">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-panel2/95 p-5 shadow-glow backdrop-blur-xl">
          <div>
            <h3 className="text-lg font-semibold">Quick actions</h3>
            <p className="mt-2 text-sm text-slate-300">Use the form below to update the employee record without leaving this page.</p>
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Record quality check</p>
            <p className="mt-2">This profile page keeps edit and delete actions next to the employee details for faster management.</p>
          </div>
        </div>
      </div>

      <EmployeeForm
        open={isEditing}
        employee={employee}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
