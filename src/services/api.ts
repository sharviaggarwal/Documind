/**
 * DocuMind Base API Client & Abstraction Layer
 * Designed for immediate plug-and-play backend integration (FastAPI, Express, LangChain, LlamaIndex).
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
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    this.isMockMode = true; // Easily switched via Settings or env
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
   * Simulates network latency for realistic UX evaluation
   */
  public async simulateLatency(minMs: number = 250, maxMs: number = 700): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generic fetch wrapper for when the live backend is connected
   */
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

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
