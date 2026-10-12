/**
 * DocuMind Base API Client & Abstraction Layer
 * Connected directly to the FastAPI backend at http://localhost:8000
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

class ApiService {
  private baseUrl: string;
  private isMockMode: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.isMockMode = false; // Connected to live FastAPI backend
  }

  public setMockMode(enabled: boolean) {
    this.isMockMode = enabled;
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Simulates latency for mock preview cards
   */
  public async simulateLatency(minMs: number = 200, maxMs: number = 500): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generic fetch wrapper for live backend calls
   */
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // Only set Content-Type to application/json when not sending FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.detail || errorData.message || `HTTP error ${response.status}`,
          statusCode: response.status,
          details: errorData,
        } as ApiError;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error(`API request error on ${endpoint}:`, error);
      throw error;
    }
  }
}

export const api = new ApiService();
