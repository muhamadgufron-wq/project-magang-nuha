import { AuthResponse } from "../types";
import { apiClient } from "@/utils/api-client";
import { API_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Melakukan pemanggilan API untuk login pengguna.
 * Menggunakan apiClient yang otomatis mengurus header dan base URL.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, { email, password });
};

/**
 * Melakukan pemanggilan API untuk pendaftaran pengguna baru.
 */
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, { name, email, password });
};
