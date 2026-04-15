import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { Employee } from '../../api/types';

type Props = {
  data: Employee[];
  isLoading: boolean;
  onView?: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

export function EmployeeTable({ data, isLoading, onView, onEdit, onDelete }: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  });

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-8 text-sm text-slate-300">Loading employees...</div>;
  }

  if (!data.length) {
    return <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-8 text-sm text-slate-300">No employees found.</div>;
  }

  return (
    <div ref={parentRef} className="h-[680px] overflow-auto rounded-2xl border border-slate-800/80 bg-slate-950/70">
      <div className="min-w-[920px]">
        <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-3 border-b border-slate-800/80 bg-slate-900/70 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-300">
          <span>Name</span>
          <span>Title</span>
          <span>Department</span>
          <span>Country</span>
          <span>Salary</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const employee = data[virtualRow.index];
            return (
              <div
                key={employee.id}
                className="absolute left-0 top-0 grid w-full grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-3 border-b border-slate-800/50 px-4 py-4 text-sm"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <button type="button" onClick={() => onView?.(employee)} className="text-left font-medium text-white transition hover:text-cyan-200">
                  {employee.full_name}
                </button>
                <span>{employee.job_title}</span>
                <span>{employee.department}</span>
                <span>{employee.country}</span>
                <span>{employee.currency} {employee.salary.toLocaleString()}</span>
                <span className="capitalize">{employee.status}</span>
                <div className="flex gap-2">
                  {onView ? <button type="button" onClick={() => onView(employee)} className="rounded-xl border border-cyan-400/30 px-3 py-1 text-cyan-200">View</button> : null}
                  <button type="button" onClick={() => onEdit(employee)} className="rounded-xl border border-violet-400/30 px-3 py-1 text-violet-200">Edit</button>
                  <button type="button" onClick={() => onDelete(employee)} className="rounded-xl border border-rose-400/30 px-3 py-1 text-rose-200">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
