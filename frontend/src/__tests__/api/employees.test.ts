import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../api/client';
import { createEmployee, deleteEmployee, fetchEmployee, fetchEmployees, fetchInsights, updateEmployee } from '../../api/employees';

vi.mock('../../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('employee api helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches employees with the provided params', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: { employees: [], meta: { page: 1, per_page: 25, total_count: 0, total_pages: 0 } } } as never);

    const result = await fetchEmployees({ q: 'design', country: 'Singapore' });

    expect(getMock).toHaveBeenCalledWith('/api/v1/employees', { params: { q: 'design', country: 'Singapore' } });
    expect(result.meta.total_count).toBe(0);
  });

  it('fetches a single employee by id', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: { employee: { id: 7, full_name: 'Maya Chen' } } } as never);

    const result = await fetchEmployee(7);

    expect(getMock).toHaveBeenCalledWith('/api/v1/employees/7');
    expect(result.employee.full_name).toBe('Maya Chen');
  });

  it('forwards a large per_page value when requesting the full employee list', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: { employees: [], meta: { page: 1, per_page: 10000, total_count: 0, total_pages: 0 } } } as never);

    await fetchEmployees({ per_page: 10000 });

    expect(getMock).toHaveBeenCalledWith('/api/v1/employees', { params: { per_page: 10000 } });
  });

  it('fetches insights in parallel and forwards the country filter to the job title request', async () => {
    const getMock = vi.mocked(api.get);
    getMock
      .mockResolvedValueOnce({ data: { overview: { headcount: 1 } } } as never)
      .mockResolvedValueOnce({ data: { countries: [] } } as never)
      .mockResolvedValueOnce({ data: { job_titles: [] } } as never);

    const result = await fetchInsights({ country: 'Singapore' });

    expect(getMock).toHaveBeenNthCalledWith(1, '/api/v1/insights/overview', { params: { country: 'Singapore' } });
    expect(getMock).toHaveBeenNthCalledWith(2, '/api/v1/insights/by_country', { params: { country: 'Singapore' } });
    expect(getMock).toHaveBeenNthCalledWith(3, '/api/v1/insights/by_job_title', { params: { country: 'Singapore' } });
    expect(result).toEqual({ overview: { headcount: 1 }, countries: [], job_titles: [] });
  });

  it('forwards both country and job title filters to the title insight request', async () => {
    const getMock = vi.mocked(api.get);
    getMock
      .mockResolvedValueOnce({ data: { overview: { headcount: 1 } } } as never)
      .mockResolvedValueOnce({ data: { countries: [] } } as never)
      .mockResolvedValueOnce({ data: { job_titles: [] } } as never);

    await fetchInsights({ country: 'Singapore', job_title: 'Engineer' });

    expect(getMock).toHaveBeenNthCalledWith(3, '/api/v1/insights/by_job_title', { params: { country: 'Singapore', job_title: 'Engineer' } });
  });

  it('submits employee create, update, and delete requests', async () => {
    const postMock = vi.mocked(api.post);
    const patchMock = vi.mocked(api.patch);
    const deleteMock = vi.mocked(api.delete);

    postMock.mockResolvedValueOnce({ data: { employee: { id: 1 } } } as never);
    patchMock.mockResolvedValueOnce({ data: { employee: { id: 1 } } } as never);
    deleteMock.mockResolvedValueOnce({ data: undefined } as never);

    await createEmployee({
      first_name: 'Maya',
      last_name: 'Chen',
      job_title: 'Designer',
      department: 'Design',
      country: 'Singapore',
      email: 'maya@example.com',
      salary: 95000,
      currency: 'SGD',
      employment_type: 'full_time',
      hired_on: '2024-01-10',
      status: 'active',
    });

    await updateEmployee(1, { status: 'inactive' });
    await deleteEmployee(1);

    expect(postMock).toHaveBeenCalledWith('/api/v1/employees', {
      employee: expect.objectContaining({ first_name: 'Maya', status: 'active' }),
    });
    expect(patchMock).toHaveBeenCalledWith('/api/v1/employees/1', { employee: { status: 'inactive' } });
    expect(deleteMock).toHaveBeenCalledWith('/api/v1/employees/1');
  });
});
