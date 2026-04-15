import { APP_PATHS, usePathname } from './lib/navigation';
import { SiteNavigation } from './components/layout/SiteNavigation';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { InsightsOverviewPage } from './pages/InsightsOverviewPage';
import { CountrySalaryInsightsPage } from './pages/CountrySalaryInsightsPage';
import { JobTitleSalaryInsightsPage } from './pages/JobTitleSalaryInsightsPage';

function renderPage(pathname: string) {
  const employeeDetailMatch = pathname.match(/^\/employees\/(\d+)$/);

  if (employeeDetailMatch) {
    return <EmployeeDetailPage employeeId={Number(employeeDetailMatch[1])} />;
  }

  if (pathname === '/employees') {
    return <EmployeesPage />;
  }

  if (pathname === APP_PATHS.insightsOverview) {
    return <InsightsOverviewPage />;
  }

  if (pathname === APP_PATHS.insightsByCountry) {
    return <CountrySalaryInsightsPage />;
  }

  if (pathname === APP_PATHS.insightsByJobTitle) {
    return <JobTitleSalaryInsightsPage />;
  }

  return <EmployeesPage />;
}

export default function App() {
  const pathname = usePathname();

  return (
    <main className="min-h-screen px-4 py-6 text-slate-100 md:px-8">
      <SiteNavigation pathname={pathname} />
      <div className="mx-auto max-w-7xl space-y-6 px-2 pb-6 md:px-0">{renderPage(pathname)}</div>
    </main>
  );
}
