type CountryMetric = {
  country: string;
  headcount: number;
  average_salary: number;
  minimum_salary: number;
  maximum_salary: number;
};

export function SalaryByCountry({ data }: { data: CountryMetric[] }) {
  const maxAverage = Math.max(...data.map((row) => row.average_salary), 1);

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
        {data.map((row) => (
          <div key={row.country} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">{row.country}</span>
              <span className="text-slate-300">${row.average_salary.toLocaleString()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{ width: `${Math.max((row.average_salary / maxAverage) * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {data.map((row) => (
        <div key={row.country} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">{row.country}</span>
            <span className="text-slate-300">{row.headcount} employees</span>
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Avg ${row.average_salary.toLocaleString()} · Min ${row.minimum_salary.toLocaleString()} · Max ${row.maximum_salary.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
