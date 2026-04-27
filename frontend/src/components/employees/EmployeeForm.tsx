import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { Employee, EmployeeFormValues } from '../../api/types';

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  job_title: z.string().min(1),
  department: z.string().min(1),
  country: z.string().min(1),
  email: z.string().email(),
  salary: z.coerce.number().min(0),
  currency: z.string().min(1),
  employment_type: z.string().min(1),
  hired_on: z.string().min(1),
  status: z.string().min(1),
});

type Props = {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
};

export function EmployeeForm({ open, employee, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: employee
      ? {
          first_name: employee.first_name,
          last_name: employee.last_name,
          job_title: employee.job_title,
          department: employee.department,
          country: employee.country,
          email: employee.email,
          salary: employee.salary,
          currency: employee.currency,
          employment_type: employee.employment_type,
          hired_on: employee.hired_on,
          status: employee.status,
        }
      : undefined,
  });

  useEffect(() => {
    reset(employee ? {
      first_name: employee.first_name,
      last_name: employee.last_name,
      job_title: employee.job_title,
      department: employee.department,
      country: employee.country,
      email: employee.email,
      salary: employee.salary,
      currency: employee.currency,
      employment_type: employee.employment_type,
      hired_on: employee.hired_on,
      status: employee.status,
    } : {
      first_name: '',
      last_name: '',
      job_title: '',
      department: '',
      country: '',
      email: '',
      salary: 0,
      currency: 'USD',
      employment_type: 'full_time',
      hired_on: new Date().toISOString().split('T')[0],
      status: 'active',
    });
  }, [employee, reset]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        >
          <motion.form
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit(onSubmit)}
            className="grid w-full max-w-4xl gap-4 rounded-3xl border border-slate-800/80 bg-panel p-6 shadow-glow"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{employee ? 'Edit employee' : 'Create employee'}</h3>
              <button type="button" onClick={onClose} className="text-sm text-slate-400">Close</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['First name', 'first_name'],
                ['Last name', 'last_name'],
                ['Job title', 'job_title'],
                ['Department', 'department'],
                ['Country', 'country'],
                ['Email', 'email'],
                ['Salary', 'salary'],
                ['Currency', 'currency'],
                ['Employment type', 'employment_type'],
                ['Status', 'status'],
              ].map(([label, field]) => (
                <label key={field} htmlFor={field} className="grid gap-2 text-sm text-slate-200">
                  <span>{label}</span>
                  <input id={field} {...register(field as keyof EmployeeFormValues)} className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none focus:border-cyan-400" />
                  {errors[field as keyof EmployeeFormValues] ? <span className="text-xs text-rose-300">Required</span> : null}
                </label>
              ))}
              <label htmlFor="hired_on" className="grid gap-2 text-sm text-slate-200">
                <span>Hired on</span>
                <ReactDatePicker
                  id="hired_on"
                  selected={watch('hired_on') ? new Date(watch('hired_on')) : null}
                  onChange={(date: Date | null) => setValue('hired_on', date ? date.toISOString().split('T')[0] : '')}
                  maxDate={new Date()}
                  className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none focus:border-cyan-400 w-full"
                  dateFormat="yyyy-MM-dd"
                />
                {errors.hired_on ? <span className="text-xs text-rose-300">Required</span> : null}
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-2xl border border-slate-700 px-5 py-3">Cancel</button>
              <button disabled={isSubmitting} type="submit" className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-medium text-slate-950">Save</button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
