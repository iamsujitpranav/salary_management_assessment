import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SalaryByCountry } from '../components/insights/SalaryByCountry';
import { SalaryByTitle } from '../components/insights/SalaryByTitle';

describe('salary charts', () => {
  it('renders country salary summaries', () => {
    render(
      <SalaryByCountry
        data={[
          { country: 'Singapore', headcount: 120, average_salary: 95000, minimum_salary: 65000, maximum_salary: 140000 },
          { country: 'Japan', headcount: 80, average_salary: 88000, minimum_salary: 50000, maximum_salary: 130000 },
        ]}
      />,
    );

    expect(screen.getAllByText('Singapore')).toHaveLength(2);
    expect(screen.getAllByText('Japan')).toHaveLength(2);
    expect(screen.getByText(/Avg \$95,000/i)).toBeInTheDocument();
  });

  it('renders job title salary summaries', () => {
    render(
      <SalaryByTitle
        data={[
          { job_title: 'Designer', headcount: 14, average_salary: 92000 },
          { job_title: 'Engineer', headcount: 42, average_salary: 115000 },
        ]}
      />,
    );

    expect(screen.getAllByText('Designer')).toHaveLength(2);
    expect(screen.getAllByText('Engineer')).toHaveLength(2);
    expect(screen.getByText(/Average \$115,000/i)).toBeInTheDocument();
  });
});
