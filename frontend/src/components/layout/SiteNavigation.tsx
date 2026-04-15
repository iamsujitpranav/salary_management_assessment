import { APP_PATHS, isActivePath, navigateTo } from '../../lib/navigation';

type NavLink = {
  href: (typeof APP_PATHS)[keyof typeof APP_PATHS];
  label: string;
  description: string;
};

const NAV_LINKS: NavLink[] = [
  { href: APP_PATHS.employees, label: 'Employees', description: 'Manage people and filters' },
  { href: APP_PATHS.insightsOverview, label: 'Overview', description: 'Salary summary metrics' },
  { href: APP_PATHS.insightsByCountry, label: 'By country', description: 'Country salary breakdowns' },
  { href: APP_PATHS.insightsByJobTitle, label: 'By job title', description: 'Title salary drill-downs' },
];

type Props = {
  pathname: string;
};

export function SiteNavigation({ pathname }: Props) {
  return (
    <header className="mx-auto max-w-7xl space-y-4 px-2 pb-2 pt-4 md:px-0">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-glow backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Salary Management</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Salary management control center</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Move between employees and dedicated salary insight pages without leaving the app.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => navigateTo(item.href)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-100'
                    : 'border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-slate-400">{item.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
