const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TestRun {
  id: string;
  url: string;
  prompt: string;
  status: string;
  result: {
    passed: boolean;
    summary: string;
    details: string;
  } | null;
  screenshot_path?: string;
  created_at: string;
  completed_at: string | null;
}

export interface TestResult {
  passed: boolean;
  summary: string;
  details: string;
  screenshotPath: string;
}

export const api = {
  signup: (email: string, password: string, name: string) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  runTest: (url: string, prompt: string) =>
    request<TestResult>('/tests', { method: 'POST', body: JSON.stringify({ url, prompt }) }),

  getTests: () =>
    request<{ runs: TestRun[] }>('/tests'),

  getTest: (id: string) =>
    request<TestRun>(`/tests/${id}`),
};