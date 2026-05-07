import { Doctor } from "../types";
import { apiClient } from "@/utils/api-client";
import { API_ENDPOINTS } from "@/utils/api-endpoints";

export interface PaginatedDoctors {
  doctors: Doctor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Mengambil daftar dokter dengan filter dan pagination.
 */
export const fetchDoctors = async (specialization?: string, page: number = 1, limit: number = 10, date?: string): Promise<PaginatedDoctors> => {
  const params = new URLSearchParams();
  if (specialization) params.append("specialization", specialization);
  if (date) params.append("date", date);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  return apiClient.get<PaginatedDoctors>(`${API_ENDPOINTS.DOCTOR.LIST}?${params.toString()}`);
};

/**
 * Mengambil detail dokter berdasarkan UUID.
 */
export const fetchDoctorById = async (id: string): Promise<Doctor> => {
  return apiClient.get<Doctor>(API_ENDPOINTS.DOCTOR.DETAIL(id));
};

/**
 * Mengambil daftar unik spesialisasi dokter.
 */
export const fetchSpecializations = async (): Promise<string[]> => {
  const data = await apiClient.get<string[]>(API_ENDPOINTS.DOCTOR.SPECIALIZATIONS);
  return Array.isArray(data) ? data : [];
};
