import { api } from './client';
import type {
  CountryInsightsResponse,
  EmployeeFormValues,
  EmployeeListResponse,
  EmployeeResponse,
  InsightsResponse,
  InsightsOverviewResponse,
  JobTitleInsightsResponse,
} from './types';

export type InsightFilters = {
  country?: string;
  job_title?: string;
};

export async function fetchEmployees(params: Record<string, string | number | undefined>) {
  const { data } = await api.get<EmployeeListResponse>('/api/v1/employees', { params });
  return data;
}

export async function fetchEmployee(id: number) {
  const { data } = await api.get<EmployeeResponse>(`/api/v1/employees/${id}`);
  return data;
}

export async function fetchInsights(filters: InsightFilters = {}) {
  const { country, job_title } = filters;
  const countryParams = country ? { country } : undefined;
  const titleParams = country || job_title ? { ...(country ? { country } : {}), ...(job_title ? { job_title } : {}) } : undefined;

  const [overviewResponse, countriesResponse, jobTitlesResponse] = await Promise.all([
    api.get('/api/v1/insights/overview', { params: countryParams }),
    api.get('/api/v1/insights/by_country', { params: countryParams }),
    api.get('/api/v1/insights/by_job_title', { params: titleParams }),
  ]);

  return {
    overview: overviewResponse.data.overview,
    countries: countriesResponse.data.countries,
    job_titles: jobTitlesResponse.data.job_titles,
  } satisfies InsightsResponse;
}

export async function fetchInsightsOverview(filters: Pick<InsightFilters, 'country'> = {}) {
  const { country } = filters;
  const { data } = await api.get<InsightsOverviewResponse>('/api/v1/insights/overview', {
    params: country ? { country } : undefined,
  });

  return data;
}

export async function fetchCountryInsights(filters: Pick<InsightFilters, 'country'> = {}) {
  const { country } = filters;
  const { data } = await api.get<CountryInsightsResponse>('/api/v1/insights/by_country', {
    params: country ? { country } : undefined,
  });

  return data;
}

export async function fetchJobTitleInsights(filters: InsightFilters = {}) {
  const { country, job_title } = filters;
  const { data } = await api.get<JobTitleInsightsResponse>('/api/v1/insights/by_job_title', {
    params: country || job_title ? { ...(country ? { country } : {}), ...(job_title ? { job_title } : {}) } : undefined,
  });

  return data;
}

export async function createEmployee(payload: EmployeeFormValues) {
  const { data } = await api.post('/api/v1/employees', { employee: payload });
  return data;
}

export async function updateEmployee(id: number, payload: Partial<EmployeeFormValues>) {
  const { data } = await api.patch(`/api/v1/employees/${id}`, { employee: payload });
  return data;
}

export async function deleteEmployee(id: number) {
  await api.delete(`/api/v1/employees/${id}`);
}
