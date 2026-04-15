import { useEffect, useState } from 'react';

export const APP_PATHS = {
  employees: '/',
  insightsOverview: '/insights/overview',
  insightsByCountry: '/insights/country',
  insightsByJobTitle: '/insights/job-title',
} as const;

export type AppPath = (typeof APP_PATHS)[keyof typeof APP_PATHS];

export function employeeDetailPath(id: number) {
  return `/employees/${id}`;
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname || APP_PATHS.employees);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || APP_PATHS.employees);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

export function navigateTo(pathname: string, search = '') {
  if (window.location.pathname === pathname && window.location.search === search) {
    return;
  }

  window.history.pushState({}, '', `${pathname}${search}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function isActivePath(pathname: string, target: AppPath) {
  if (target === APP_PATHS.employees) {
    return pathname === APP_PATHS.employees || pathname === '/employees' || pathname.startsWith('/employees/');
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}
