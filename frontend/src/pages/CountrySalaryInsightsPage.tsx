import { useMemo, useState } from 'react';
import { useCountryInsights } from '../hooks/useEmployees';
import type { CountryInsight } from '../api/types';

export function CountrySalaryInsightsPage() {
  const [country, setCountry] = useState('');
  const allCountriesQuery = useCountryInsights();
  const countryMetricsQuery = useCountryInsights(country ? { country } : {});

  const countryOptions = useMemo<string[]>(() => {
    const countries = (allCountriesQuery.data?.countries ?? []) as CountryInsight[];
    return Array.from(new Set(countries.map(({ country: optionCountry }) => optionCountry))).sort();
  }, [allCountriesQuery.data?.countries]);

  const rows = countryMetricsQuery.data?.countries ?? [];
  const summary = useMemo(() => {
    const totalHeadcount = rows.reduce((total, row) => total + row.headcount, 0);
    const averageAcrossRows = rows.length
      ? (rows.reduce((total, row) => total + row.average_salary, 0) / rows.length).toFixed(2)
      : '0.00';

    return { totalHeadcount, averageAcrossRows };
  }, [rows]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800/80 bg-panel/95 p-6 shadow-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Salary insights</p>
        <h2 className="mt-2 text-3xl font-semibold">Country salary insights</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Compare average, minimum, and maximum salary in a single table, with a quick spread calculation per country.
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
          <span className="text-sm text-slate-300">
            {country ? `Showing salary metrics for ${country}` : 'Showing salary metrics for all countries'}
          </span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Countries shown</p>
          <div className="mt-2 text-3xl font-semibold text-white">{rows.length}</div>
        </div>
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Total headcount</p>
          <div className="mt-2 text-3xl font-semibold text-white">{summary.totalHeadcount.toLocaleString()}</div>
        </div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-glow">
          <p className="text-sm text-slate-300">Average salary across rows</p>
          <div className="mt-2 text-3xl font-semibold text-white">${Number(summary.averageAcrossRows).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-panel2/95 shadow-glow backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.2em] text-slate-300">
              <tr>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Headcount</th>
                <th className="px-5 py-4">Avg salary</th>
                <th className="px-5 py-4">Min salary</th>
                <th className="px-5 py-4">Max salary</th>
                <th className="px-5 py-4">Spread</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.country} className="border-t border-slate-800/80 hover:bg-slate-950/60">
                  <td className="px-5 py-4 font-medium text-white">{row.country}</td>
                  <td className="px-5 py-4 text-slate-200">{row.headcount}</td>
                  <td className="px-5 py-4 text-cyan-200">${row.average_salary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-emerald-200">${row.minimum_salary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-amber-200">${row.maximum_salary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-300">${(row.maximum_salary - row.minimum_salary).toLocaleString()}</td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td className="px-5 py-8 text-slate-300" colSpan={6}>No country metrics available.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
