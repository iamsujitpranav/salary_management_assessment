import { useMemo, useState } from 'react';
import { StatCard } from '../components/insights/StatCard';
import { useCountryInsights, useInsightsOverview } from '../hooks/useEmployees';
import { getCountryOptions } from '../lib/countryOptions';

const STATUS_OPTIONS = ['active', 'on_leave', 'inactive', 'terminated'];

export function InsightsOverviewPage() {
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const countryListQuery = useCountryInsights();
  const overviewQuery = useInsightsOverview({
    ...(country ? { country } : {}),
    ...(status ? { status } : {}),
  });

  const countryOptions = useMemo(() => getCountryOptions(countryListQuery.data?.countries), [countryListQuery.data?.countries]);

  const overview = overviewQuery.data?.overview;
  const employmentTypeBreakdown = overview?.employment_type_breakdown ?? {};
  const employmentEntries = Object.entries(employmentTypeBreakdown);

  const getFilterLabel = () => {
    const filters = [];
    if (country) filters.push(country);
    if (status) filters.push(status.replace(/_/g, ' '));
    if (filters.length === 0) return 'Showing global salary metrics';
    return `Showing metrics for ${filters.join(' • ')}`;
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Salary insights</p>
        <h2 className="mt-2 text-3xl font-semibold">Salary overview</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Inspect minimum, maximum, and average salary across the entire dataset or narrow the view by country and status.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-5 shadow-glow backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
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
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-cyan-400"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <span className="text-sm text-slate-300">{getFilterLabel()}</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Headcount" value={overview?.headcount ?? 0} accent="violet" />
        <StatCard label="Average salary" value={overview?.average_salary ?? 0} accent="cyan" prefix="$" />
        <StatCard label="Min salary" value={overview?.minimum_salary ?? 0} accent="emerald" prefix="$" />
        <StatCard label="Max salary" value={overview?.maximum_salary ?? 0} accent="amber" prefix="$" />
        <StatCard label="Top country" value={overview?.top_country ?? '—'} accent="fuchsia" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-panel2/95 p-5 shadow-glow backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Employment type breakdown</h3>
          <div className="mt-4 space-y-3">
            {employmentEntries.length ? (
              employmentEntries.map(([employmentType, count]) => (
                <div key={employmentType} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white capitalize">{employmentType.replace(/_/g, ' ')}</span>
                    <span className="text-slate-300">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 text-sm text-slate-300">
                No employment type metrics available.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-panel2/95 p-5 shadow-glow backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Helpful notes</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Use the country and status filters to narrow down metrics to specific regions or employment states.</li>
            <li>The metrics are calculated from the live employee dataset in the backend.</li>
            <li>Job title drill-downs live on the dedicated title page for cleaner filtering.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
