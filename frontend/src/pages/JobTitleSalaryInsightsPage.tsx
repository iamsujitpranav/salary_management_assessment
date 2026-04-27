import { useMemo, useState } from 'react';
import { useCountryInsights, useJobTitleInsights } from '../hooks/useEmployees';
import { getCountryOptions } from '../lib/countryOptions';

export function JobTitleSalaryInsightsPage() {
  const [country, setCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const allCountriesQuery = useCountryInsights();
  const titleMetricsQuery = useJobTitleInsights({ country: country || undefined, job_title: jobTitle || undefined });

  const countryOptions = useMemo(() => getCountryOptions(allCountriesQuery.data?.countries), [allCountriesQuery.data?.countries]);

  const rows = titleMetricsQuery.data?.job_titles ?? [];
  const visibleRows = useMemo(() => {
    const normalizedCountrySearch = countrySearch.trim().toLowerCase();

    if (!normalizedCountrySearch) {
      return rows;
    }

    return rows.filter((row) => row.country.toLowerCase().includes(normalizedCountrySearch));
  }, [countrySearch, rows]);
  const summary = useMemo(() => {
    const totalHeadcount = visibleRows.reduce((total, row) => total + row.headcount, 0);
    const averageSalary = visibleRows.length ? (visibleRows.reduce((total, row) => total + row.average_salary, 0) / visibleRows.length).toFixed(2) : '0.00';

    return { totalHeadcount, averageSalary };
  }, [visibleRows]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Salary insights</p>
        <h2 className="mt-2 text-3xl font-semibold">Job title salary insights</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Use the filters to inspect job title salary averages by country, with a sortable-style table layout for quick scanning.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-800/80 bg-panel/95 p-5 shadow-glow backdrop-blur-xl">
        <select
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-cyan-400"
        >
          <option value="">All countries</option>
          {countryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          placeholder="Type a job title"
          className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
        />
        <input
          value={countrySearch}
          onChange={(event) => setCountrySearch(event.target.value)}
          placeholder="Search by country"
          className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Job titles shown</p>
          <div className="mt-2 text-3xl font-semibold text-white">{visibleRows.length}</div>
        </div>
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Total headcount</p>
          <div className="mt-2 text-3xl font-semibold text-white">{summary.totalHeadcount.toLocaleString()}</div>
        </div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Average salary across titles</p>
          <div className="mt-2 text-3xl font-semibold text-white">${Number(summary.averageSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-panel2/95 shadow-glow backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.2em] text-slate-300">
              <tr>
                <th className="px-5 py-4">Job title</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Headcount</th>
                <th className="px-5 py-4">Avg salary</th>
                <th className="px-5 py-4">Country filter</th>
                <th className="px-5 py-4">Salary index</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={`${row.job_title}-${row.country}`} className="border-t border-slate-800/80 hover:bg-slate-950/60">
                  <td className="px-5 py-4 font-medium text-white">{row.job_title}</td>
                  <td className="px-5 py-4 text-slate-200">{row.country}</td>
                  <td className="px-5 py-4 text-slate-200">{row.headcount}</td>
                  <td className="px-5 py-4 text-cyan-200">${row.average_salary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-300">{country || 'All countries'}</td>
                  <td className="px-5 py-4 text-emerald-200">{row.headcount > 0 ? Math.round(row.average_salary / row.headcount).toLocaleString() : '0'}</td>
                </tr>
              ))}
              {!visibleRows.length ? (
                <tr>
                  <td className="px-5 py-8 text-slate-300" colSpan={6}>No job title metrics available.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
