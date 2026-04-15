export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  job_title: string;
  department: string;
  country: string;
  email: string;
  salary: number;
  currency: string;
  employment_type: string;
  hired_on: string;
  status: string;
};

export type EmployeeFormValues = Omit<Employee, 'id' | 'full_name'>;

export type InsightOverview = {
  headcount: number;
  average_salary: number;
  minimum_salary: number;
  maximum_salary: number;
  top_country: string | null;
  employment_type_breakdown: Record<string, number>;
};

export type CountryInsight = {
  country: string;
  job_title: string;
  headcount: number;
  average_salary: number;
  minimum_salary: number;
  maximum_salary: number;
};

export type JobTitleInsight = {
  job_title: string;
  country: string;
  headcount: number;
  average_salary: number;
};

export type EmployeeListResponse = {
  employees: Employee[];
  meta: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};

export type EmployeeResponse = {
  employee: Employee;
};

export type InsightsResponse = {
  overview: InsightOverview;
  countries: CountryInsight[];
  job_titles: JobTitleInsight[];
};

export type InsightsOverviewResponse = {
  overview: InsightOverview;
};

export type CountryInsightsResponse = {
  countries: CountryInsight[];
};

export type JobTitleInsightsResponse = {
  job_titles: JobTitleInsight[];
};
