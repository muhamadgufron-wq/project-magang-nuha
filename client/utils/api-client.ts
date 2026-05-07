import { getCookie } from "./cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API Client (Fetch Wrapper)
 * Pembungkus fetch agar kita tidak perlu menulis header dan base URL berulang-ulang.
 * Otomatis menangani JSON dan otentikasi (Bearer Token).
 */
export const apiClient = {
  /**
   * Helper internal untuk melakukan request
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getCookie("token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Terjadi kesalahan pada server");
    }

    // Mengasumsikan backend selalu membungkus data dalam properti 'data'
    return data.data as T;
  },

  /**
   * HTTP GET
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * HTTP POST
   */
  async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * HTTP PUT
   */
  async put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  /**
   * HTTP DELETE
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
