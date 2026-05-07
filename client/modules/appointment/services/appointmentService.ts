import { Registered, CreateRegistrationRequest } from "../types";
import { apiClient } from "@/utils/api-client";
import { API_ENDPOINTS } from "@/utils/api-endpoints";

/**
 * Membuat pendaftaran janji temu baru.
 */
export const createRegistration = async (data: CreateRegistrationRequest): Promise<Registered> => {
  return apiClient.post<Registered>(API_ENDPOINTS.APPOINTMENT.CREATE, data);
};

/**
 * Mengambil daftar janji temu milik pengguna yang sedang login.
 */
export const fetchMyRegistrations = async (): Promise<Registered[]> => {
  const data = await apiClient.get<Registered[]>(API_ENDPOINTS.APPOINTMENT.MY_APPOINTMENTS);
  return Array.isArray(data) ? data : [];
};

/**
 * Membatalkan janji temu.
 * Catatan: Menggunakan PATCH untuk update status.
 */
export const cancelRegistration = async (id: number): Promise<Registered> => {
  return apiClient.request<Registered>(`${API_ENDPOINTS.APPOINTMENT.CREATE}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "CANCELLED" }),
  });
};
