const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  /** Skip the global onUnauthorized handling (used for auth endpoints like login/me). */
  public?: boolean;
}

function buildQuery(params?: QueryParams): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

class ApiClient {
  private baseUrl: string;
  private unauthorizedHandler: (() => void) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUnauthorizedHandler(handler: (() => void) | null) {
    this.unauthorizedHandler = handler;
  }

  private async errorDetail(response: Response): Promise<string> {
    try {
      const data = await response.json();
      if (data && typeof data.detail === 'string') return data.detail;
    } catch {
      /* ignore */
    }
    return `Request failed (${response.status})`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    isBlob: boolean = false,
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, public: isPublic = false } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !isPublic) {
      this.unauthorizedHandler?.();
      throw new Error(await this.errorDetail(response));
    }

    if (!response.ok) {
      throw new Error(await this.errorDetail(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    if (isBlob) {
      return (await response.blob()) as T;
    }

    return (await response.json()) as T;
  }

  async get<T>(endpoint: string, params?: QueryParams, options: RequestOptions = {}): Promise<T> {
    const query = buildQuery(params);
    return this.request<T>(`${endpoint}${query}`, options);
  }

  async post<T>(endpoint: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, ...options });
  }

  async put<T>(endpoint: string, body: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, ...options });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  async getBlob(endpoint: string): Promise<Blob> {
    return this.request<Blob>(endpoint, {}, true);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);