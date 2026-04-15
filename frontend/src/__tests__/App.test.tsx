import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../pages/EmployeesPage', () => ({ EmployeesPage: () => <div>employees route</div> }));
vi.mock('../pages/EmployeeDetailPage', () => ({ EmployeeDetailPage: () => <div>employee detail route</div> }));
vi.mock('../pages/InsightsOverviewPage', () => ({ InsightsOverviewPage: () => <div>overview route</div> }));
vi.mock('../pages/CountrySalaryInsightsPage', () => ({ CountrySalaryInsightsPage: () => <div>country route</div> }));
vi.mock('../pages/JobTitleSalaryInsightsPage', () => ({ JobTitleSalaryInsightsPage: () => <div>job title route</div> }));

describe('App', () => {
  it('renders the employee page at the root route', () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(screen.getByText('employees route')).toBeTruthy();
  });

  it('renders the country salary insights page on the country route', () => {
    window.history.pushState({}, '', '/insights/country');

    render(<App />);

    expect(screen.getByText('country route')).toBeTruthy();
  });

  it('renders the employee detail page on the detail route', () => {
    window.history.pushState({}, '', '/employees/7');

    render(<App />);

    expect(screen.getByText('employee detail route')).toBeTruthy();
  });
});
